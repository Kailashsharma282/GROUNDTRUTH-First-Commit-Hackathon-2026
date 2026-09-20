import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface SageMakerConstructProps {
  evidenceBucket: s3.IBucket;
  endpointName?: string;
}

export class SageMakerConstruct extends Construct {
  public readonly executionRole: iam.Role;
  public readonly endpointName: string;

  constructor(scope: Construct, id: string, props: SageMakerConstructProps) {
    super(scope, id);

    this.endpointName = props.endpointName || 'groundtruth-vision-reasoner-prod';

    // IAM Execution Role for SageMaker AI
    this.executionRole = new iam.Role(this, 'SageMakerExecutionRole', {
      roleName: `${this.endpointName}-exec-role`,
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
      description: 'IAM execution role granting SageMaker read/write access to evidence vault and CloudWatch logs'
    });

    this.executionRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess')
    );
    props.evidenceBucket.grantReadWrite(this.executionRole);
  }
}
