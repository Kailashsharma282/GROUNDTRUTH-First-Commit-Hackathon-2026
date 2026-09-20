import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface SageMakerConstructProps {
  evidenceBucket: s3.IBucket;
  endpointName?: string;
}

export class SageMakerConstruct extends Construct {
  public readonly endpoint: sagemaker.CfnEndpoint;
  public readonly executionRole: iam.Role;
  public readonly endpointName: string;

  constructor(scope: Construct, id: string, props: SageMakerConstructProps) {
    super(scope, id);

    this.endpointName = props.endpointName || 'groundtruth-vision-reasoner-v1';

    // IAM Execution Role for SageMaker
    this.executionRole = new iam.Role(this, 'SageMakerExecutionRole', {
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
      description: 'IAM role granting SageMaker read permissions on evidence bucket and CloudWatch logging'
    });

    this.executionRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess')
    );
    props.evidenceBucket.grantRead(this.executionRole);

    // Cost-Optimized SageMaker Model definition (PyTorch Vision Container)
    const model = new sagemaker.CfnModel(this, 'VisionReasonerModel', {
      modelName: `${this.endpointName}-model`,
      executionRoleArn: this.executionRole.roleArn,
      primaryContainer: {
        image: '763104351884.dkr.ecr.us-east-1.amazonaws.com/pytorch-inference:2.1.0-cpu-py310-ubuntu20.04-ec2',
        mode: 'SingleModel',
        environment: {
          SAGEMAKER_PROGRAM: 'inference.py',
          SAGEMAKER_SUBMIT_DIRECTORY: `s3://${props.evidenceBucket.bucketName}/models/inference.tar.gz`
        }
      }
    });

    // Endpoint Configuration (using ml.m5.large for cost awareness)
    const endpointConfig = new sagemaker.CfnEndpointConfig(this, 'VisionReasonerEndpointConfig', {
      endpointConfigName: `${this.endpointName}-config`,
      productionVariants: [
        {
          variantName: 'AllTraffic',
          modelName: model.modelName!,
          initialInstanceCount: 1,
          instanceType: 'ml.m5.large',
          initialVariantWeight: 1.0
        }
      ]
    });
    endpointConfig.addResourceDependency(model);

    // SageMaker Real-Time Endpoint
    this.endpoint = new sagemaker.CfnEndpoint(this, 'VisionReasonerEndpoint', {
      endpointName: this.endpointName,
      endpointConfigName: endpointConfig.endpointConfigName!
    });
    this.endpoint.addResourceDependency(endpointConfig);
  }
}
