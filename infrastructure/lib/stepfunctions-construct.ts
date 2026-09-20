import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';

export interface StepFunctionsConstructProps {
  inspectionHandler: lambda.IFunction;
  findingsTable: dynamodb.ITable;
  criticalAlertTopic: sns.ITopic;
}

export class StepFunctionsConstruct extends Construct {
  public readonly stateMachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props: StepFunctionsConstructProps) {
    super(scope, id);

    // 1. Task: Validate Input & Requirement
    const validateTask = new tasks.LambdaInvoke(this, 'ValidateInputTask', {
      lambdaFunction: props.inspectionHandler,
      payload: sfn.TaskInput.fromObject({
        step: 'VALIDATE_REQUIREMENT',
        inspectionData: sfn.JsonPath.stringAt('$')
      }),
      resultPath: '$.validation'
    });

    // 2. Task: Invoke SageMaker AI Vision Reasoner
    const sagemakerInferenceTask = new tasks.LambdaInvoke(this, 'InvokeSageMakerTask', {
      lambdaFunction: props.inspectionHandler,
      payload: sfn.TaskInput.fromObject({
        step: 'INVOKE_SAGEMAKER',
        inspectionData: sfn.JsonPath.stringAt('$.validation.Payload')
      }),
      resultPath: '$.inferenceResult',
      retryOnServiceExceptions: true
    });

    // 3. Task: Persist Finding & Update State
    const persistFindingTask = new tasks.LambdaInvoke(this, 'PersistFindingTask', {
      lambdaFunction: props.inspectionHandler,
      payload: sfn.TaskInput.fromObject({
        step: 'PERSIST_FINDING',
        resultData: sfn.JsonPath.stringAt('$.inferenceResult.Payload')
      }),
      resultPath: '$.persistedFinding'
    });

    // 4. Task: Publish SNS Notification for Critical/High findings
    const notifyTask = new tasks.SnsPublish(this, 'PublishCriticalAlertTask', {
      topic: props.criticalAlertTopic,
      message: sfn.TaskInput.fromJsonPathAt('$.persistedFinding.Payload.notificationMessage'),
      subject: 'GroundTruth Reality Gap Alert'
    });

    // Branching logic: Check if reality gap detected
    const checkGapChoice = new sfn.Choice(this, 'CheckRealityGapDetected')
      .when(
        sfn.Condition.booleanEquals('$.inferenceResult.Payload.realityGapDetected', true),
        persistFindingTask.next(notifyTask)
      )
      .otherwise(new sfn.Pass(this, 'CompliantPassState'));

    const definition = validateTask
      .next(sagemakerInferenceTask)
      .next(checkGapChoice);

    this.stateMachine = new sfn.StateMachine(this, 'InspectionAnalysisStateMachine', {
      stateMachineName: 'GroundTruth-Inspection-Pipeline',
      definitionBody: sfn.DefinitionBody.fromChainable(definition),
      timeout: cdk.Duration.minutes(5),
      tracingEnabled: true
    });
  }
}
