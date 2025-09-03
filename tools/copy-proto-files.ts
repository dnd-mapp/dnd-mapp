import { async as glob } from 'fast-glob';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { basename, join, normalize } from 'path';
import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const assetsBasePath = 'src/assets/proto';

const fileHeader =
    `// NOTE: Don't edit this file! This file is copied over from the shared-api library to make consuming
// the protobuf definitions in the actual applications easier. Should you need to make any changes, make
// the desired changes to the source files in that library and rerun the build of the application.

` as const;

async function copyProtoFile(filePath: string, destinationPath: string) {
    const fileContents = await readFile(filePath, { encoding: 'utf8' });

    await writeFile(destinationPath, fileHeader + fileContents);
}

async function main() {
    const args = await yargs(hideBin(process.argv))
        .options({
            appPath: {
                type: 'string',
                array: false,
                boolean: false,
                config: false,
                count: false,
                demandOption: true,
                description: 'The path to the app that the protobuf files are copied to.',
                normalize: true,
                number: false,
                string: true,
            },
        })
        .parse();

    console.log('Copying proto files');

    let protoFiles = await glob('libs/shared-api/src/assets/proto/*.proto');
    protoFiles = protoFiles.map((protoFile) => normalize(protoFile));

    if (protoFiles.length === 0) {
        console.warn('Found no proto files to copy');
        return;
    }
    const assetsPath = normalize(join(args.appPath, assetsBasePath));

    console.log(`\nMaking sure assets folder at path "${assetsPath}" exists`);

    await mkdir(assetsPath, { recursive: true });

    await Promise.all(
        protoFiles.map((protoFilePath) => {
            const protoFileName = basename(protoFilePath);
            const destination = normalize(join(assetsPath, protoFileName));
            console.log(`Copying proto file "${protoFileName}" from "${protoFilePath}" to "${destination}"`);

            return copyProtoFile(protoFilePath, destination);
        })
    );
    console.log('\nProto files copied successfully');
}

main();
