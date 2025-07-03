import * as aws from '@pulumi/aws';
import { getTags } from './tags';

const vpc = new aws.ec2.Vpc('brevly-vpc', {
  cidrBlock: '10.0.0.0/16',
  enableDnsHostnames: true,
  enableDnsSupport: true,
  tags: getTags('vpc'),
});

// Internet Gateway
const igw = new aws.ec2.InternetGateway('brevly-igw', {
  vpcId: vpc.id,
  tags: getTags('igw'),
});

// Subnets Públicas
const publicSubnets: aws.ec2.Subnet[] = [];
for (let i = 1; i <= 3; i++) {
  publicSubnets.push(
    new aws.ec2.Subnet(`public-subnet-${i}`, {
      vpcId: vpc.id,
      cidrBlock: `10.0.${i}.0/24`,
      availabilityZone: `us-east-2${String.fromCharCode(96 + i)}`, // a, b, c
      mapPublicIpOnLaunch: true,
      tags: getTags(`public-subnet-${i}`),
    }),
  );
}

// Subnets Privadas
const privateSubnets: aws.ec2.Subnet[] = [];
for (let i = 1; i <= 3; i++) {
  privateSubnets.push(
    new aws.ec2.Subnet(`private-subnet-${i}`, {
      vpcId: vpc.id,
      cidrBlock: `10.0.10${i}.0/24`,
      availabilityZone: `us-east-2${String.fromCharCode(96 + i)}`,
      mapPublicIpOnLaunch: false,
      tags: getTags(`private-subnet-${i}`),
    }),
  );
}

// Route Table Pública
const publicRouteTable = new aws.ec2.RouteTable('public-rt', {
  vpcId: vpc.id,
  routes: [{ cidrBlock: '0.0.0.0/0', gatewayId: igw.id }],
  tags: getTags('public-rt'),
});

publicSubnets.forEach((subnet, i) => {
  new aws.ec2.RouteTableAssociation(`public-rt-assoc-${i}`, {
    subnetId: subnet.id,
    routeTableId: publicRouteTable.id,
  });
});

// NAT Gateway (1 por simplicidade - zona A)
const eip = new aws.ec2.Eip('nat-eip', {
  domain: 'vpc',
  tags: getTags('nat-eip'),
});
const natGateway = new aws.ec2.NatGateway('brevly-nat', {
  subnetId: publicSubnets[0].id,
  allocationId: eip.id,
  tags: getTags('nat-gateway'),
});

// // Route Table Privada
const privateRouteTable = new aws.ec2.RouteTable('private-rt', {
  vpcId: vpc.id,
  routes: [{ cidrBlock: '0.0.0.0/0', natGatewayId: natGateway.id }],
  tags: getTags('private-rt'),
});

privateSubnets.forEach((subnet, i) => {
  new aws.ec2.RouteTableAssociation(`private-rt-assoc-${i}`, {
    subnetId: subnet.id,
    routeTableId: privateRouteTable.id,
  });
});

export { vpc, publicSubnets, privateSubnets };
