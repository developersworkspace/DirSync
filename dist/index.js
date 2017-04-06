"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
var fileSystem_1 = require("./gateways/fileSystem");
exports.FileSystemGateway = fileSystem_1.FileSystemGateway;
var rackspace_1 = require("./gateways/rackspace");
exports.RackspaceGateway = rackspace_1.RackspaceGateway;
var registry_1 = require("./gateways/registry");
exports.RegistryGateway = registry_1.RegistryGateway;
function sync(sourceGateway, destinationGateway) {
    return __awaiter(this, void 0, void 0, function* () {
        sourceGateway.listFiles().then((files) => __awaiter(this, void 0, void 0, function* () {
            log(`Retrieved ${files.length} files`);
            for (let i = 0; i < files.length; i++) {
                let filePath = files[i];
                let directoryName = path.dirname(filePath);
                let r = yield destinationGateway.directoryExist(directoryName).then((directoryExistResult) => {
                    if (!directoryExistResult) {
                        return destinationGateway.createDirectory(directoryName).then((createDirectoryResult) => {
                            log(`Created directory ${directoryName}`);
                            return true;
                        });
                    }
                    else {
                        return true;
                    }
                }).then((trueResult) => {
                    return destinationGateway.fileExist(filePath);
                }).then((fileExistResult) => {
                    if (fileExistResult) {
                        log(`Comparing files ${filePath}`);
                        return Promise.all([
                            sourceGateway.getFileComparator(filePath),
                            sourceGateway.getFileComparator(filePath)
                        ]);
                    }
                    else {
                        return Promise.all([
                            '0',
                            '1'
                        ]);
                    }
                }).then((hashes) => {
                    if (hashes[0] != hashes[1]) {
                        log(`Mismatch in hash ${filePath}`);
                        return true;
                    }
                    else {
                        return false;
                    }
                }).then((shouldCopyToDestinationResult) => {
                    if (shouldCopyToDestinationResult) {
                        log(`Queued for copying ${filePath}`);
                        return Promise.all([
                            sourceGateway.getFileReadStream(filePath),
                            destinationGateway.getFileWriteStream(filePath)
                        ]);
                    }
                    else {
                        return Promise.all([
                            null, null
                        ]);
                    }
                }).then((streams) => {
                    if (streams[0] == null || streams[1] == null) {
                        log(`No streams ${filePath}`);
                        return true;
                    }
                    else {
                        log(`Copying file ${filePath}`);
                        return sourceGateway.copy(streams[0], streams[1]);
                    }
                }).then((result) => {
                    log('DONE');
                    return true;
                });
            }
        }));
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
    });
}
exports.sync = sync;
function log(message) {
    console.log(message);
}
