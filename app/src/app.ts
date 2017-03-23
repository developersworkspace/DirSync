import { FileSystemGateway } from './gateways/fileSystem';
import { RackspaceGateway } from './gateways/rackspace';
import * as path from 'path';

function sync(sourceGateway: FileSystemGateway, destinationGateway: FileSystemGateway) {

    sourceGateway.listFiles().then((files: string[]) => {

        log(`Retrieved ${files.length} files`);

        for (let i = 0; i < files.length; i++) {
            let filePath = files[i];
            let directoryName = path.dirname(filePath);

            destinationGateway.directoryExist(directoryName).then((directoryExistResult: Boolean) => {
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
            }).then((hashes: string[]) => {
                if (hashes[0] != hashes[1]) {
                    return true;
                } else {
                    return false;
                }
            }).then((shouldCopyToDestinationResult: Boolean) => {
                if (shouldCopyToDestinationResult) {
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

                } else {
                    log(`Copying file ${filePath}`);
                    streams[0].pipe(streams[1]);
                }
                return true;
            });
        }
    });


    destinationGateway.listFiles().then((files: string[]) => {
        for (let i = 0; i < files.length; i++) {
            let filePath = files[i];

            sourceGateway.fileExist(filePath).then((fileExistResult: Boolean) => {
                if (!fileExistResult) {
                    return destinationGateway.deleteFile(filePath);
                } else {
                    return null;
                }
            }).then((result) => {
                if (result != null) {
                    log(`Delete file ${filePath}`);
                }
            });
        }
    });

}

function log(message: string) {
    console.log(message);
}


let sourceGateway = new FileSystemGateway('C:/Temp/Test');
let destinationGateway = new FileSystemGateway('C:/Temp/TestDIST');


sync(sourceGateway, destinationGateway);

