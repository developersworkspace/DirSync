import { FileSystemGateway } from './gateways/fileSystem';
import { RackspaceGateway } from './gateways/rackspace';
import { RegistryGateway } from './gateways/registry';
import { Gateway } from './gateways/base';
import * as path from 'path';

import * as Promise from 'bluebird';

async function sync(sourceGateway: Gateway, destinationGateway: Gateway) {

    sourceGateway.listFiles().then(async (files: string[]) => {

        log(`Retrieved ${files.length} files`);

        for (let i = 0; i < files.length; i++) {
            let filePath = files[i];
            let directoryName = path.dirname(filePath);

            let r = await destinationGateway.directoryExist(directoryName).then((directoryExistResult: Boolean) => {
                if (!directoryExistResult) {
                    return destinationGateway.createDirectory(directoryName).then((createDirectoryResult: Boolean) => {
                        log(`Created directory ${directoryName}`);
                        return true;
                    })
                } else {
                    return true;
                }
            }).then((trueResult: Boolean) => {
                return destinationGateway.fileExist(filePath);
            }).then((fileExistResult: Boolean) => {
                if (fileExistResult) {
                    log(`Comparing files ${filePath}`);
                    return Promise.all([
                        sourceGateway.getFileComparator(filePath),
                        sourceGateway.getFileComparator(filePath)
                    ]);
                } else {
                    return Promise.all([
                        '0',
                        '1'
                    ]);
                }
            }).then((hashes: any) => {
                if (hashes[0] != hashes[1]) {
                    log(`Mismatch in hash ${filePath}`);
                    return true;
                } else {
                    return false;
                }
            }).then((shouldCopyToDestinationResult: Boolean) => {
                if (shouldCopyToDestinationResult) {
                    console.log(`Queued for copying ${filePath}`);
                    return Promise.all([
                        sourceGateway.getFileReadStream(filePath),
                        destinationGateway.getFileWriteStream(filePath)
                    ]);
                } else {
                    return Promise.all([
                        null, null
                    ]);
                }
            }).then((streams: any) => {
                if (streams[0] == null || streams[1] == null) {
                    log(`No streams ${filePath}`);
                    return true;
                } else {
                    log(`Copying file ${filePath}`);

                    return sourceGateway.copy(streams[0], streams[1]);
                }
            }).then((result: Boolean) => {

                log('DONE');
                return true;
            });
        }
    });


    // destinationGateway.listFiles().then((files: string[]) => {
    //     for (let i = 0; i < files.length; i++) {
    //         let filePath = files[i];

    //         sourceGateway.fileExist(filePath).then((fileExistResult: Boolean) => {
    //             if (!fileExistResult) {
    //                 return destinationGateway.deleteFile(filePath);
    //             } else {
    //                 return null;
    //             }
    //         }).then((result) => {
    //             if (result != null) {
    //                 log(`Delete file ${filePath}`);
    //             }
    //         });
    //     }
    // });

}

async function processFile(files: string[]) {

}

function log(message: string) {
    console.log(message);
}

// let sourceGateway = new FileSystemGateway('F:/Temp/Source');
// let destinationGateway = new FileSystemGateway('F:/Temp/Destination');
// let destinationGatewayWithRegistry = new RegistryGateway(destinationGateway);


let sourceGateway = new RackspaceGateway('Barend.Erasmus', '', 'LON', 'LVE_PassportGrinds');
let destinationGateway = new FileSystemGateway('D:/Temp/CLOUD');

sync(sourceGateway, destinationGateway);



