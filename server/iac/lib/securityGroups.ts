import * as aws from '@pulumi/aws';
import { getTags } from './tags';
import { vpc } from './vpc';

// SG para o ALB — expõe portas 80 (HTTP) e 443 (HTTPS) para o mundo
const albSg = new aws.ec2.SecurityGroup('alb-sg', {
  vpcId: vpc.id,
  description: 'Allow HTTP and HTTPS from anywhere',
  ingress: [
    { protocol: 'tcp', fromPort: 80, toPort: 80, cidrBlocks: ['0.0.0.0/0'] },
    { protocol: 'tcp', fromPort: 443, toPort: 443, cidrBlocks: ['0.0.0.0/0'] },
  ],
  egress: [
    { protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] },
  ],
  tags: getTags('alb-sg'),
});

// SG para ECS — permite tráfego apenas vindo do ALB
const ecsSg = new aws.ec2.SecurityGroup('ecs-sg', {
  vpcId: vpc.id,
  description: 'Allow traffic from ALB only',
  ingress: [
    {
      protocol: 'tcp',
      fromPort: 3333,
      toPort: 3333,
      securityGroups: [albSg.id],
    },
  ],
  egress: [
    { protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] },
  ],
  tags: getTags('ecs-sg'),
});

const rdsSg = new aws.ec2.SecurityGroup('rds-sg', {
  vpcId: vpc.id,
  description: 'Allow PostgreSQL access',
  ingress: [
    {
      protocol: 'tcp',
      fromPort: 5432,
      toPort: 5432,
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
  egress: [
    { protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] },
  ],
  tags: getTags('rds-sg'),
});

export { albSg, ecsSg, rdsSg };
