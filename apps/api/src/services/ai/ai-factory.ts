import { IAIProvider } from './ai-provider.interface.js';
import { SageMakerAIProvider } from './sagemaker-provider.js';
import { DeterministicDemoProvider } from './demo-provider.js';
import { AWS_CONFIG } from '../../config/aws.js';
import { AIProviderType } from '@groundtruth/shared';

export class AIFactory {
  private static instance: IAIProvider;
  private static currentProviderType: AIProviderType = AWS_CONFIG.aiProvider;

  public static getProvider(): IAIProvider {
    if (!this.instance) {
      this.instance = this.currentProviderType === 'sagemaker' 
        ? new SageMakerAIProvider() 
        : new DeterministicDemoProvider();
    }
    return this.instance;
  }

  public static setProviderType(type: AIProviderType): void {
    this.currentProviderType = type;
    this.instance = type === 'sagemaker' 
      ? new SageMakerAIProvider() 
      : new DeterministicDemoProvider();
    console.log(`[AIFactory] Switched active AI Provider to: ${type}`);
  }

  public static getCurrentProviderType(): AIProviderType {
    return this.currentProviderType;
  }
}
