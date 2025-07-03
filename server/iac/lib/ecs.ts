import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { targetGroup } from './alb';
import { ecrRepoUrl } from './ecr';
import { ecsSg } from './securityGroups';
import { getTags } from './tags';
import { privateSubnets } from './vpc';

const config = new pulumi.Config();
const dopplerToken = config.requireSecret('DOPPLER_TOKEN');

const ecsCluster = new aws.ecs.Cluster('brevly-cluster', {
  name: 'brevly-cluster',
  tags: getTags('ecs-cluster'),
});

const ecsTaskExecutionRole = new aws.iam.Role('ecs-task-execution-role', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: 'ecs-tasks.amazonaws.com',
  }),
  tags: getTags('ecs-task-execution-role'),
});

new aws.iam.RolePolicyAttachment('ecs-task-execution-policy', {
  role: ecsTaskExecutionRole.name,
  policyArn: aws.iam.ManagedPolicy.AmazonECSTaskExecutionRolePolicy,
});

new aws.iam.RolePolicyAttachment('ecs-task-execution-cloudwatch', {
  role: ecsTaskExecutionRole.name,
  policyArn: 'arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy',
});

const _logGroup = new aws.cloudwatch.LogGroup('ecs-logs', {
  name: '/ecs/brevly',
  retentionInDays: 7,
  tags: getTags('cloudwatch-loggroup'),
});

const taskDefinition = new aws.ecs.TaskDefinition('brevly-task', {
  family: 'brevly-task',
  cpu: '256',
  memory: '512',
  networkMode: 'awsvpc',
  requiresCompatibilities: ['FARGATE'],
  executionRoleArn: ecsTaskExecutionRole.arn,
  containerDefinitions: pulumi
    .output([
      {
        name: 'platform-backend',
        image: pulumi.interpolate`${ecrRepoUrl}:staging`,
        essential: true,
        portMappings: [{ containerPort: 8000 }],
        environment: [
          { name: 'DOPPLER_TOKEN', value: dopplerToken },
          { name: 'environment', value: 'staging' },
        ],
        logConfiguration: {
          logDriver: 'awslogs',
          options: {
            'awslogs-group': '/ecs/brevly',
            'awslogs-region': 'us-east-2',
            'awslogs-stream-prefix': 'ecs',
          },
        },
      },
    ])
    .apply(JSON.stringify),
  tags: getTags('ecs-task'),
});

const service = new aws.ecs.Service('brevly-service', {
  name: 'brevly-service',
  cluster: ecsCluster.arn,
  desiredCount: 1,
  // launchType: "FARGATE",
  capacityProviderStrategies: [
    { capacityProvider: 'FARGATE_SPOT', weight: 1 },
    { capacityProvider: 'FARGATE', weight: 0 },
  ],
  taskDefinition: taskDefinition.arn,
  networkConfiguration: {
    subnets: privateSubnets.map((s) => s.id),
    assignPublicIp: false,
    securityGroups: [ecsSg.id],
  },
  loadBalancers: [
    {
      targetGroupArn: targetGroup.arn,
      containerName: 'platform-backend',
      containerPort: 8000,
    },
  ],
  tags: getTags('ecs-service'),
});

export { ecsCluster, service, taskDefinition };
