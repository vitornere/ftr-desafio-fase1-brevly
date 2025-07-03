import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { rdsSg } from './securityGroups';
import { getTags } from './tags';
import { publicSubnets } from './vpc';

// Carregando config segura para usuário e senha
const config = new pulumi.Config('rds');
const dbName = config.get('dbName') || 'brevlydb';
const dbUser = config.get('dbUser') || 'brevly';
const dbPassword = config.requireSecret('dbPassword');

// Subnet Group para o RDS
const subnetGroup = new aws.rds.SubnetGroup('rds-subnet-group', {
  subnetIds: publicSubnets.map((s) => s.id),
  tags: getTags('rds-subnet-group'),
});

// Instância RDS PostgreSQL 16
const dbInstance = new aws.rds.Instance('brevly-db', {
  engine: 'postgres',
  engineVersion: '16',
  instanceClass: 'db.t3.micro',
  allocatedStorage: 20,
  dbName,
  username: dbUser,
  password: dbPassword,
  dbSubnetGroupName: subnetGroup.name,
  vpcSecurityGroupIds: [rdsSg.id],
  skipFinalSnapshot: true,
  publiclyAccessible: true,
  multiAz: false,
  backupRetentionPeriod: 0,
  storageEncrypted: false,
  tags: getTags('rds-instance'),
});

export const rdsEndpoint = dbInstance.endpoint;
export const rdsDbName = dbInstance.dbName;
export const rdsUsername = dbInstance.username;
