import * as aws from '@pulumi/aws';
import { getTags } from './tags';

// Zona pública no Route53
export const hostedZone = new aws.route53.Zone('nereswe-zone', {
  name: 'nereswe.com',
  comment: 'Public hosted zone for nereswe',
  tags: getTags('route53-zone'),
});
