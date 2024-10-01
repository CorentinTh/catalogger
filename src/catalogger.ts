import type { DependencyPresenceDetails } from './types';
import { exec } from 'node:child_process';
import { cwd as getCwd } from 'node:process';
import { promisify } from 'node:util';
import { chain, map } from 'lodash-es';
import semver from 'semver';

const execAsync = promisify(exec);

export async function getPackagesByDependencies({ cwd = getCwd() }: { cwd?: string } = { }) {
  const { stdout } = await execAsync('pnpm -r ls --json', { cwd });
  const packagesDeps = JSON.parse(stdout);

  const dependenciesByPackages: DependencyPresenceDetails[] = chain(packagesDeps)
    .map(({ dependencies = {}, name: packageName, path: packagePath, devDependencies = {} }) => [
      ...map(dependencies, ({ version }, dependencyName) => ({ dependencyName, packageName, version, packagePath, isDevDependency: false })),
      ...map(devDependencies, ({ version }, dependencyName) => ({ dependencyName, packageName, version, packagePath, isDevDependency: true })),
    ])
    .flatten()
    .filter(({ version }) => semver.valid(version) !== null)
    .groupBy('dependencyName')
    .map(dependencies => ({
      dependencyName: dependencies[0].dependencyName,
      highestVersion: semver.maxSatisfying(map(dependencies, 'version'), '*') as unknown as string,
      packages: map(dependencies, ({ packageName, version, packagePath, isDevDependency }) => ({
        packageName,
        version,
        packagePath,
        isDevDependency,
      })),
    }))
    .filter(({ packages }) => packages.length > 1)
    .sortBy(({ packages }) => -packages.length)
    .value();

  return dependenciesByPackages;
}
