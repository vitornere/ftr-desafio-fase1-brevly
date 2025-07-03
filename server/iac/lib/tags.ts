export function getTags(resource: string): Record<string, string> {
  return {
    managed: 'iac',
    project: 'brevly',
    resource,
    environment: 'staging',
  };
}

export function getTagsWithPropagateAtLaunch(
  resource: string,
): { key: string; value: string; propagateAtLaunch: boolean }[] {
  return Object.entries(getTags(resource)).map(([key, value]) => ({
    key,
    value,
    propagateAtLaunch: true,
  }));
}
