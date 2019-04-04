import pkg from "./package.json";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";

let plugins = [babel(pkg.babel), terser(), sizeSnapshot()];

export default [
	{
		input: pkg.source,
		output: [
			{
				file: pkg.main,
				sourcemap: true,
				format: "cjs"
			},
			{
				file: pkg["umd:main"],
				sourcemap: true,
				format: "umd",
				name: pkg.name
			},
			{
				file: pkg["module"],
				sourcemap: true,
				format: "es"
			}
		],
		plugins
	},
	...["atomico", "preact"].map(file => ({
		input: `components/${file}.js`,
		output: [
			{
				file: `${file}.js`,
				sourcemap: true,
				format: "cjs"
			},
			{
				file: `${file}.mjs`,
				sourcemap: true,
				format: "es"
			}
		],
		plugins
	}))
];
