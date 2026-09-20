"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepFunctionsConstruct = void 0;
const constructs_1 = require("constructs");
const sfn = require("aws-cdk-lib/aws-stepfunctions");
const tasks = require("aws-cdk-lib/aws-stepfunctions-tasks");
const cdk = require("aws-cdk-lib");
class StepFunctionsConstruct extends constructs_1.Construct {
    stateMachine;
    constructor(scope, id, props) {
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
            .when(sfn.Condition.booleanEquals('$.inferenceResult.Payload.realityGapDetected', true), persistFindingTask.next(notifyTask))
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
exports.StepFunctionsConstruct = StepFunctionsConstruct;
