import { cwd as getCwd } from 'node:process';
import { defineCommand, runMain } from 'citty';
import { getPackagesByDependencies } from './catalogger';
import { reportAsJson, reportAsText } from './reporters';

const main = defineCommand({
  meta: {
    name: 'catalogger',
    description: 'Find pnpm catalog candidates in your monorepos',
  },
  args: {
    json: {
      type: 'boolean',
      description: 'Output as JSON',
      alias: ['j'],
      default: false,
      valueHint: 'boolean',
    },
    cwd: {
      type: 'positional',
      description: 'Current working directory',
      valueHint: 'string',
      required: false,
    },
  },
  run: async ({ args }) => {
    const { json: outputAsJson, cwd = getCwd() } = args;

    const dependenciesDetails = await getPackagesByDependencies({ cwd });

    if (outputAsJson) {
      return reportAsJson({ dependenciesDetails });
    }

    reportAsText({ dependenciesDetails });
  },
});

runMain(main);
