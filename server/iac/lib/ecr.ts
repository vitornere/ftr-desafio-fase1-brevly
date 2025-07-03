import * as aws from '@pulumi/aws';
import { getTags } from './tags';

// Repositório para a imagem Docker do platform-backend
const ecrRepo = new aws.ecr.Repository('platform-backend-repo', {
  name: 'platform-backend',
  imageScanningConfiguration: {
    scanOnPush: false,
  },
  imageTagMutability: 'MUTABLE',
  tags: getTags('ecr'),
});

new aws.ecr.LifecyclePolicy('platform-backend-policy', {
  repository: ecrRepo.name,
  policy: JSON.stringify({
    rules: [
      {
        rulePriority: 1,
        description: 'Remove untagged images older than 7 days',
        selection: {
          tagStatus: 'untagged',
          countType: 'sinceImagePushed',
          countUnit: 'days',
          countNumber: 7,
        },
        action: { type: 'expire' },
      },
      {
        rulePriority: 2,
        description: 'Expire versioned images (v*) older than 30 days',
        selection: {
          tagStatus: 'tagged',
          tagPrefixList: ['v'],
          countType: 'sinceImagePushed',
          countUnit: 'days',
          countNumber: 30,
        },
        action: { type: 'expire' },
      },
    ],
  }),
});

export const ecrRepoUrl = ecrRepo.repositoryUrl;
export const ecrRepoName = ecrRepo.name;
