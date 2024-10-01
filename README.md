# Catalogger - Find PNPM catalog candidates

A CLI to easily find dependencies and devDependencies that are common in your pnpm workspace monorepo and could be added to your [pnpm workspace catalog](https://pnpm.io/catalogs). Note that catalogs requires pnpm v9.5.0 or higher.

## Installation

```bash
# Using npm
npm install -g @corentinth/catalogger

# Using yarn
yarn global add @corentinth/catalogger

# Using pnpm
pnpm add -g @corentinth/catalogger
```

## Usage

Then just run the following command in your pnpm workspace monorepo:

```bash
catalogger
```

More options are available, you can see them by running:

```bash
catalogger --help
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

## Credits and Acknowledgements

This project is crafted with ❤️ by [Corentin Thomasset](https://corentin.tech).
