import pkg from "./package.json";
import buble from "rollup-plugin-buble";
import nodent from "rollup-plugin-nodent";
import { terser } from "rollup-plugin-terser";

let plugins = [
    //nodent(),
    //buble({
    //    jsx: "h",
    //    objectAssign: "Object.assign"
    //}),
    terser()
];

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
    }
    //{
    //    input: "components/atomico.js",
    //    output: [
    //        {
    //            file: "components.js",
    //            sourcemap: true,
    //            format: "cjs"
    //        },
    //        {
    //            file: "components.mjs",
    //            sourcemap: true,
    //            format: "es"
    //        }
    //    ],
    //    plugins
    //}
];
