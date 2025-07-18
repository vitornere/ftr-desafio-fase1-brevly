import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { hostedZone } from './route53';
import { albSg } from './securityGroups';
import { getTags } from './tags';
import { publicSubnets, vpc } from './vpc';

const config = new pulumi.Config();
const domain = 'nereswe.com';
const subdomain = 'api.brevly';
const fullDomain = `${subdomain}.${domain}`;
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

// 4. HTTPS Listener com redirecionamento do HTTP
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

// 5. Listener HTTP redirecionando para HTTPS
new aws.lb.Listener('http-listener', {
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

// 6. Registro no Route53 apontando para o ALB
new aws.route53.Record('staging-dns', {
  name: fullDomain,
  zoneId: hostedZone.id,
  type: 'A',
  aliases: [
    {
      name: alb.dnsName,
      zoneId: alb.zoneId,
      evaluateTargetHealth: true,
    },
  ],
});

export { alb, targetGroup, fullDomain };
