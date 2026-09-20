"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SageMakerConstruct = void 0;
const constructs_1 = require("constructs");
const iam = require("aws-cdk-lib/aws-iam");
class SageMakerConstruct extends constructs_1.Construct {
    executionRole;
    endpointName;
    constructor(scope, id, props) {
        super(scope, id);
        this.endpointName = props.endpointName || 'groundtruth-vision-reasoner-prod';
        // IAM Execution Role for SageMaker AI
        this.executionRole = new iam.Role(this, 'SageMakerExecutionRole', {
            roleName: `${this.endpointName}-exec-role`,
            assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
            description: 'IAM execution role granting SageMaker read/write access to evidence vault and CloudWatch logs'
        });
        this.executionRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));
        props.evidenceBucket.grantReadWrite(this.executionRole);
    }
}
exports.SageMakerConstruct = SageMakerConstruct;
