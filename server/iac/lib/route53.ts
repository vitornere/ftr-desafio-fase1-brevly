import * as aws from '@pulumi/aws';
import { getTags } from './tags';

// Zona pública no Route53
export const hostedZone = new aws.route53.Zone('brevly-zone', {
  name: 'brevly.com',
  comment: 'Public hosted zone for brevly',
  tags: getTags('route53-zone'),
});
