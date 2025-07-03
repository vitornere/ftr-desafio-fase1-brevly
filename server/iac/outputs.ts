export { fullDomain } from './lib/alb';
export { ecrRepoUrl } from './lib/ecr';
export { service } from './lib/ecs';
export { rdsEndpoint } from './lib/rds';

import { hostedZone } from './lib/route53';

export const nameServersText = hostedZone.nameServers.apply(
  (servers: string[]) => servers.join('\n'),
);
