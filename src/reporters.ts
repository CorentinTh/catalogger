/* eslint-disable no-console */
import type { DependencyPresenceDetails } from './types';
import { sumBy, uniqBy } from 'lodash-es';
import pc from 'picocolors';

export { reportAsJson, reportAsText };

function reportAsJson({ dependenciesDetails }: { dependenciesDetails: DependencyPresenceDetails[] }) {
  return console.log(JSON.stringify(dependenciesDetails, null, 2));
}

function reportAsText({ dependenciesDetails }: { dependenciesDetails: DependencyPresenceDetails[] }) {
  console.log(dependenciesDetails.map(({ dependencyName, packages }) => `${pc.green(pc.bold(dependencyName))} in ${packages.length} packages (${sumBy(packages, ({ isDevDependency }) => isDevDependency ? 0 : 1)} deps, ${sumBy(packages, ({ isDevDependency }) => isDevDependency ? 1 : 0)} devDeps) version ${uniqBy(packages, 'version').map(({ version }) => pc.bold(pc.blue(version))).join(', ')}`).join('\n'));

  console.log(`\nCatalog entries:\n\ncatalog:\n${dependenciesDetails.sort(({ dependencyName: a }, { dependencyName: b }) => a.localeCompare(b)).map(({ dependencyName, highestVersion }) => `  "${dependencyName}": ${highestVersion}`).join('\n')}\n`);
}
