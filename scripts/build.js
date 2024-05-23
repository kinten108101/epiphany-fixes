#!/usr/bin/env node

import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const targetDirectory = dirname(fileURLToPath(new URL(import.meta.url)));
const workingDirectory = `${targetDirectory}/..`;

await (async () => {
    const { readdir, writeFile, lstat } = await import("node:fs/promises");
    const originDir = `${workingDirectory}/src/origins`;
    const dirs = (await Promise.all(
        (await readdir(originDir)).map(x => 
            lstat(`${originDir}/${x}`).then(y => {
                return { isdir: y.isDirectory(), path: x };
            })
        )
    )).filter(x => x.isdir).map(x => x.path);
    await writeFile(`${workingDirectory}/src/origins/index.js`,
    `// THIS FILE WAS AUTO-GENERATED - DO NOT EDIT
    ${(await Promise.all(dirs.map(x => {
        const script = `${workingDirectory}/src/origins/${x}/index.js`;
        return lstat(script).then(y => {
            return { isfile: y.isFile(), path: x };
        }, y => {
            return { isfile: false };
        });
    }))).filter(x => x.isfile).map(x => x.path).map(x => {
        const shortX = x.replaceAll(".", "_dot_");
        return `import _${shortX} from "./${x}/index.js";\nObject.assign(_${shortX}, { initName: "${x}" });\nexport const ${shortX} = _${shortX};`;
    }).reduce((acc, x) => `${acc}\n${x}`, "")}
`
    );
    await writeFile(`${workingDirectory}/src/origins/index.scss`, 
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
    entryPoints: [ `${workingDirectory}/src/index.js` ],
    bundle: true,
    outfile: `${workingDirectory}/_build/index.js`,
    plugins: [
        sassPlugin({
            filter: /\.scss$/,
            type: "css",
        })
    ]
});

await (async () => {
    const { promisify } = await import("node:util");
    const { execAsync } = await import("node:child_process").then(({ exec }) => ({ execAsync: promisify(exec) }));
    await execAsync(`notify-send Success`);
});
