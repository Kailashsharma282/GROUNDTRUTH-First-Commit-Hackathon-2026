import { Request, Response } from 'express';
import { AWS_CONFIG } from '../config/aws.js';
import { AIFactory } from '../services/ai/ai-factory.js';

export class HealthController {
  public static async checkHealth(req: Request, res: Response) {
    const aiProvider = AIFactory.getProvider();
    const aiHealth = await aiProvider.checkHealth();

    return res.json({
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      service: 'GroundTruth Reality Verification API',
      version: '1.0.0',
      track: 'SHIP IT',
      participant: 'Pochiraju Kailash Ram Markandeya Sharma',
      team: 'KGP_unknown_Coder_404',
      environment: AWS_CONFIG.appEnv,
      aws: {
        region: AWS_CONFIG.region,
        s3: {
          bucket: AWS_CONFIG.s3Bucket,
          status: 'CONFIGURED'
        },
        dynamodb: {
          prefix: AWS_CONFIG.dynamoPrefix,
          status: 'CONFIGURED'
        },
        cognito: {
          userPoolId: AWS_CONFIG.userPoolId ? 'CONFIGURED' : 'UNSET'
        },
        ai: {
          activeProvider: AIFactory.getCurrentProviderType(),
          endpoint: AWS_CONFIG.sagemakerEndpoint,
          status: aiHealth.healthy ? 'READY' : 'DEGRADED',
          details: aiHealth.details
        }
      }
    });
  }
}

export class SettingsController {
  public static async getSettings(req: Request, res: Response) {
    return res.json({
      success: true,
      data: {
        region: AWS_CONFIG.region,
        s3Bucket: AWS_CONFIG.s3Bucket,
        dynamoPrefix: AWS_CONFIG.dynamoPrefix,
        userPoolId: AWS_CONFIG.userPoolId,
        clientId: AWS_CONFIG.clientId,
        sagemakerEndpoint: AWS_CONFIG.sagemakerEndpoint,
        activeAIProvider: AIFactory.getCurrentProviderType(),
        appEnv: AWS_CONFIG.appEnv
      }
    });
  }

  public static async updateAIProvider(req: Request, res: Response) {
    const { provider } = req.body;
    if (provider !== 'sagemaker' && provider !== 'demo') {
      return res.status(400).json({ success: false, error: 'Provider must be "sagemaker" or "demo"' });
    }

    AIFactory.setProviderType(provider);
    return res.json({
      success: true,
      message: `AI provider switched to ${provider}`,
      activeAIProvider: AIFactory.getCurrentProviderType()
    });
  }
}
