#!/usr/bin/env node

import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

await (async () => {
    const { readdir, writeFile, lstat } = await import("node:fs/promises");
    const originDir = "./src/origins";
    const dirs = (await Promise.all(
        (await readdir(originDir)).map(x => 
            lstat(`${originDir}/${x}`).then(y => {
                return { isdir: y.isDirectory(), path: x };
            })
        )
    )).filter(x => x.isdir).map(x => x.path);
    await writeFile("./src/origins/index.scss", 
    `/* THIS FILE WAS AUTO-GENERATED - DO NOT EDIT */
    ${dirs.map(x => {
        const shortX = x.replaceAll(".", "-");
        const escapedX = x.replaceAll(".", "\\.");
        return `@use \"${escapedX}\" as ${shortX};`;
    }).reduce((acc, x) => `${acc}\n${x}`, "")}
    ${dirs.map(x => {
        const shortX = x.replaceAll(".", "-");
        const escapedX = x.replaceAll(".", "\\.");
        return `body.${escapedX} {\n\t@include ${shortX}.default;\n}`;
    }).reduce((acc, x) => `${acc}\n\n${x}`, "")}
`
    );
})();

await esbuild.build({
    entryPoints: [ "src/index.js" ],
    bundle: true,
    outfile: "_build/index.js",
    plugins: [
        sassPlugin({
            filter: /\.scss$/,
            type: "css",
        })
    ]
});
