import { FileSystemGateway } from './gateways/fileSystem';
import * as path from 'path';

function sync(sourceDirectory, destinationDirectory) {
    let sourceGateway = new FileSystemGateway(sourceDirectory);
    let destinationGateway = new FileSystemGateway(destinationDirectory);

    sourceGateway.listFiles('.').then((files: string[]) => {
        for (let i = 0; i < files.length; i++) {
            let filePath = files[i];
            let directoryName = path.dirname(filePath);

            if (!destinationGateway.directoryExist(directoryName)) {
                destinationGateway.createDirectory(directoryName);
            }

            if (destinationGateway.fileExist(filePath)) {
                if (sourceGateway.getFileComparator(filePath) != destinationGateway.getFileComparator(filePath)) {
                    sourceGateway.getFileReadStream(filePath).pipe(destinationGateway.getFileWriteStream(filePath));
                }
            } else {
                sourceGateway.getFileReadStream(filePath).pipe(destinationGateway.getFileWriteStream(filePath));
            }
        }
    });


    destinationGateway.listFiles('.').then((files: string[]) => {
        for (let i = 0; i < files.length; i++) {
            let filePath = files[i];

            if (!sourceGateway.fileExist(filePath)) {
                destinationGateway.deleteFile(filePath);
            }
        }
    });

}




sync('./src/source', './src/destination');