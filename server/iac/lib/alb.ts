import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { albSg } from './securityGroups';
import { getTags } from './tags';
import { publicSubnets, vpc } from './vpc';

// 2. Application Load Balancer
const alb = new aws.lb.LoadBalancer('brevly-alb', {
  internal: false,
  loadBalancerType: 'application',
  securityGroups: [albSg.id],
  subnets: publicSubnets.map((s) => s.id),
  tags: getTags('alb'),
  preserveHostHeader: true,
});

// 3. Target Group (porta 8000, usada no container do Django)
const targetGroup = new aws.lb.TargetGroup('brevly-tg', {
  port: 8000,
  protocol: 'HTTP',
  targetType: 'ip',
  vpcId: vpc.id,
  healthCheck: {
    path: '/api/health/',
    interval: 30,
    timeout: 5,
    healthyThreshold: 2,
    unhealthyThreshold: 2,
    matcher: '200-399',
  },
  tags: getTags('alb-tg'),
});

// 5. Listener HTTP redirecionando para HTTPS
const _httpListener = new aws.lb.Listener('http-listener', {
  loadBalancerArn: alb.arn,
  port: 80,
  protocol: 'HTTP',
  defaultActions: [
    {
      type: 'forward',
      targetGroupArn: targetGroup.arn,
    },
  ],
  tags: getTags('alb-listener'),
});

export { alb, targetGroup };
