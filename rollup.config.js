/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

import dotenv from 'dotenv';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';
import svelte from 'rollup-plugin-svelte';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';

dotenv.config();

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

// Production environments should specify the environment variable "BASE_URL" if the application
// is to be served at a URL other than root. The scripts in package json include setting of
// "BASE_URL" for production builds ("build" script)
// Set up the BASE_URL parameter, ensuring it has a trailing slash
let BASE_URL = '';
if (process.env.BASE_URL) {
  BASE_URL = process.env.BASE_URL.toString().trim();
  if (BASE_URL.substr(-1) !== '/') {
    BASE_URL = `${BASE_URL}/`;
  }
}

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	onwarn(warning);

// output: { ...config.client.output(),  sourcemap: true },
export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				preventAssignment: true,
				values:{
					'process.browser': true,
          'process.env.NODE_ENV': JSON.stringify(mode),
          'process.env.BASE_URL': JSON.stringify(BASE_URL),
          'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
          'process.env.API_VERSION': JSON.stringify(process.env.API_VERSION),
          'process.env.CHANNEL_TOKEN': JSON.stringify(process.env.CHANNEL_TOKEN),
          'process.env.PREVIEW': JSON.stringify(process.env.PREVIEW),
          'process.env.AUTH': JSON.stringify(process.env.AUTH),
          'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
          'process.env.CLIENT_SECRET': JSON.stringify(process.env.CLIENT_SECRET),
          'process.env.CLIENT_SCOPE_URL': JSON.stringify(process.env.CLIENT_SCOPE_URL),
          'process.env.IDCS_URL': JSON.stringify(process.env.IDCS_URL),
          'process.env.PORT': JSON.stringify(process.env.PORT)
				},
			}),
			svelte({
				compilerOptions: {
					dev,
					hydratable: true
				}
			}),
			url({
				sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
				publicPath: '/client/'
			}),
			resolve({
				browser: true,
        preferBuiltins: false,
				dedupe: ['svelte']
			}),
			commonjs({}),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				preventAssignment: true,
				values:{
					'process.browser': false,
          'process.env.NODE_ENV': JSON.stringify(mode),
          'process.env.BASE_URL': JSON.stringify(BASE_URL),
          'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
          'process.env.API_VERSION': JSON.stringify(process.env.API_VERSION),
          'process.env.CHANNEL_TOKEN': JSON.stringify(process.env.CHANNEL_TOKEN),
          'process.env.PREVIEW': JSON.stringify(process.env.PREVIEW),
          'process.env.AUTH': JSON.stringify(process.env.AUTH),
          'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
          'process.env.CLIENT_SECRET': JSON.stringify(process.env.CLIENT_SECRET),
          'process.env.CLIENT_SCOPE_URL': JSON.stringify(process.env.CLIENT_SCOPE_URL),
          'process.env.IDCS_URL': JSON.stringify(process.env.IDCS_URL),
          'process.env.PORT': JSON.stringify(process.env.PORT)
				},
			}),
			svelte({
				compilerOptions: {
					dev,
					generate: 'ssr',
					hydratable: true
				},
				emitCss: false
			}),
			url({
				sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
				publicPath: '/client/',
				emitFiles: false // already emitted by client build
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),
		preserveEntrySignatures: 'strict',
		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				preventAssignment: true,
				values:{
					'process.browser': true,
					'process.env.NODE_ENV': JSON.stringify(mode)
				},
			}),
			commonjs(),
			!dev && terser()
		],
		preserveEntrySignatures: false,
		onwarn,
	}
};
