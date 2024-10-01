export type PackageDependency = {
  packageName: string;
  version: string;
  packagePath: string;
  isDevDependency: boolean;
};

export type DependencyPresenceDetails = {
  dependencyName: string;
  highestVersion: string;
  packages: PackageDependency[];
};
