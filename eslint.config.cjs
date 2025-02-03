/* eslint-disable-next-line @typescript-eslint/no-require-imports */
const { dirname } = require('path');
/* eslint-disable-next-line @typescript-eslint/no-require-imports */
const { fileURLToPath, pathToFileURL } = require('url');
/* eslint-disable-next-line @typescript-eslint/no-require-imports */
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(pathToFileURL(__filename))),
});

/** @type {import('eslint').Linter.Config} */
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

module.exports = eslintConfig;
