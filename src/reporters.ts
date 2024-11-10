/* eslint-disable no-console */
import type { DependencyPresenceDetails } from './types';
import { sumBy, uniqBy } from 'lodash-es';
import pc from 'picocolors';

export { reportAsJson, reportAsText };

function reportAsJson({ dependenciesDetails }: { dependenciesDetails: DependencyPresenceDetails[] }) {
  return console.log(JSON.stringify(dependenciesDetails, null, 2));
}

function reportAsText({ dependenciesDetails, shouldUpdate }: { dependenciesDetails: DependencyPresenceDetails[]; shouldUpdate?: boolean }) {
  if (dependenciesDetails.length === 0) {
    return console.log('No dependencies found for pnpm catalog.');
  }

  const formatVersions = ({ packages }: { packages: { version: string }[] }) => uniqBy(packages, 'version').map(({ version }) => pc.bold(pc.blue(version))).join(', ');
  const getDependencyCount = ({ packages }: { packages: { isDevDependency }[] }) => sumBy(packages, ({ isDevDependency }) => isDevDependency ? 1 : 0);
  const getDevDependencyCount = ({ packages }: { packages: { isDevDependency }[] }) => sumBy(packages, ({ isDevDependency }) => isDevDependency ? 0 : 1);

  console.log(`\n${`Found ${dependenciesDetails.length} dependencies in more than one package:`}\n`);
  console.log(dependenciesDetails.map(({ dependencyName, packages }) => `${pc.green(pc.bold(dependencyName))} ${pc.dim(`in ${packages.length} packages (${getDependencyCount({ packages })} deps, ${getDevDependencyCount({ packages })} devDeps)`)} version ${formatVersions({ packages })}`).join('\n'));
  console.log('\nCatalog entries:');
  console.log(pc.dim(`\ncatalog:\n${dependenciesDetails.sort(({ dependencyName: a }, { dependencyName: b }) => a.localeCompare(b)).map(({ dependencyName, highestVersion }) => `  "${dependencyName}": ${highestVersion}`).join('\n')}\n`));

  if (shouldUpdate) {
    console.log(pc.yellowBright(`✨ changes written to ${pc.underline('package.json')} and ${pc.underline('pnpm-workspace.yaml')}, run ${pc.cyan('npm i')} to install updates`));
  } else {
    console.log(`Run ${pc.cyan(`catalogger -u`)} to update package.json and pnpm-workspace.yaml`);
  }
}
