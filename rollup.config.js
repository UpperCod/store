import pkg from "./package.json";
import buble from "rollup-plugin-buble";
import { terser } from "rollup-plugin-terser";

export default {
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
    plugins: [
        buble({
            objectAssign: "Object.assign"
        }),
        terser()
    ]
};
