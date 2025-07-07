import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { albSg } from './securityGroups';
import { getTags } from './tags';
import { publicSubnets, vpc } from './vpc';

const config = new pulumi.Config();

const certificateArn = config.get('certificateArn');

// 2. Application Load Balancer
const alb = new aws.lb.LoadBalancer('brevly-alb', {
  internal: false,
  loadBalancerType: 'application',
  securityGroups: [albSg.id],
  subnets: publicSubnets.map((s) => s.id),
  tags: getTags('alb'),
  preserveHostHeader: true,
});

const targetGroup = new aws.lb.TargetGroup('brevly-tg', {
  port: 3333,
  protocol: 'HTTP',
  targetType: 'ip',
  vpcId: vpc.id,
  healthCheck: {
    path: '/health/',
    interval: 30,
    timeout: 5,
    healthyThreshold: 2,
    unhealthyThreshold: 2,
    matcher: '200-399',
  },
  tags: getTags('alb-tg'),
});

if (certificateArn) {
  new aws.lb.Listener('https-listener', {
    loadBalancerArn: alb.arn,
    port: 443,
    protocol: 'HTTPS',
    sslPolicy: 'ELBSecurityPolicy-2016-08',
    certificateArn: certificateArn,
    defaultActions: [
      {
        type: 'forward',
        targetGroupArn: targetGroup.arn,
      },
    ],
    tags: getTags('alb-listener'),
  });

  const httpListener = new aws.lb.Listener('http-listener', {
    loadBalancerArn: alb.arn,
    port: 80,
    protocol: 'HTTP',
    defaultActions: [
      {
        type: 'redirect',
        redirect: {
          port: '443',
          protocol: 'HTTPS',
          statusCode: 'HTTP_301',
        },
      },
    ],
    tags: getTags('alb-listener'),
  });

  new aws.lb.ListenerRule('http-api-forward', {
    listenerArn: httpListener.arn,
    priority: 10,
    conditions: [
      {
        pathPattern: { values: ['/api/*'] },
      },
    ],
    actions: [
      {
        type: 'forward',
        targetGroupArn: targetGroup.arn,
      },
    ],
  });
} else {
  new aws.lb.Listener('http-listener', {
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
}

export { alb, targetGroup };
