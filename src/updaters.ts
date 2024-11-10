import type { DependencyPresenceDetails } from './types';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export { updateDependencies };

async function updateDependencies({ dependenciesDetails, cwd }: { dependenciesDetails: DependencyPresenceDetails[]; cwd?: string }) {
  await updateWorkpaceFile({ dependenciesDetails, cwd });
  await updatePackageJsonFiles({ dependenciesDetails });
}

async function updateWorkpaceFile({ dependenciesDetails, cwd }: { dependenciesDetails: DependencyPresenceDetails[]; cwd?: string }) {
  const workspaceFilePath = path.resolve(cwd, 'pnpm-workspace.yaml');
  const content = await readFile(workspaceFilePath, { encoding: 'utf-8' });
  const workspaceYaml = YAML.parse(content);

  if (!workspaceYaml.catalog) {
    workspaceYaml.catalog = {};
  }
  dependenciesDetails.forEach((depDetail) => {
    const { dependencyName, highestVersion } = depDetail;
    const prefix = '^';
    workspaceYaml.catalog[dependencyName] = `${prefix}${highestVersion}`;
  });
  await writeFile(workspaceFilePath, YAML.stringify(workspaceYaml, null), { encoding: 'utf8' });
}

async function updatePackageJsonFiles({ dependenciesDetails }: { dependenciesDetails: DependencyPresenceDetails[] }) {
  // Process one dependency one at a time, doing it in parallel seem to break some files.
  for (const depDetail of dependenciesDetails) {
    const { dependencyName } = depDetail;
    for (const packagesToUpdate of depDetail.packages) {
      const { packagePath } = packagesToUpdate;
      await updatePackageVersion({
        cwd: packagePath,
        newVersion: `catalog:`,
        packageName: dependencyName,
      });
    }
  };
}

async function updatePackageVersion(options: { cwd: string; newVersion: string; packageName: string }) {
  const { cwd, newVersion, packageName } = options;
  const packagePath = path.resolve(cwd, 'package.json');

  const content = await readFile(packagePath, { encoding: 'utf-8' });
  const packageJson = JSON.parse(content);

  const dependencyTypes = ['dependencies', 'devDependencies'];

  for (const type of dependencyTypes) {
    if (packageJson[type]?.[packageName]) {
      packageJson[type][packageName] = newVersion;
      break;
    }
  }

  await writeFile(packagePath, JSON.stringify(packageJson, null, 2), { encoding: 'utf8' });
}
