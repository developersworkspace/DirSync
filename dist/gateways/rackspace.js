"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pkgcloud = require("pkgcloud");
class RackspaceGateway {
    constructor(username, apiKey, region, containerName) {
        this.username = username;
        this.apiKey = apiKey;
        this.region = region;
        this.containerName = containerName;
        this.client = pkgcloud.storage.createClient({
            provider: 'rackspace',
            username: username,
            apiKey: apiKey,
            region: region
        });
    }
    createDirectory(dirPath) {
        return Promise.resolve(true);
    }
    listFileObjects() {
        return new Promise((fulfill, reject) => {
            this.client.getFiles(this.containerName, (err, files) => {
                if (err) {
                    reject(err);
                }
                else {
                    fulfill(files.filter(x => x.contentType != 'application/directory').map(x => {
                        return {
                            name: x.name,
                            md5: x.etag
                        };
                    }));
                }
            });
        });
    }
    listFiles() {
        return new Promise((fulfill, reject) => {
            this.client.getFiles(this.containerName, (err, files) => {
                if (err) {
                    reject(err);
                }
                else {
                    fulfill(files.filter(x => x.contentType != 'application/directory').map(x => x.name));
                }
            });
        });
    }
    getFileReadStream(filePath) {
        let stream = this.client.download({
            container: this.containerName,
            remote: filePath
        });
        return Promise.resolve(stream);
    }
    getFileWriteStream(filePath) {
        let stream = this.client.upload({
            container: this.containerName,
            remote: filePath
        });
        return Promise.resolve(stream);
    }
    getFileComparator(filePath) {
        return new Promise((fulfill, reject) => {
            this.client.getFile(this.containerName, filePath, (err, result) => {
                if (err) {
                    console.log(filePath);
                    reject(err);
                }
                else {
                    fulfill(result.etag);
                }
            });
        });
    }
    deleteFile(filePath) {
        return new Promise((fulfill, reject) => {
            this.client.removeFile(this.containerName, filePath, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    fulfill(true);
                }
            });
        });
    }
    deleteDirectory(dirPath) {
        return Promise.resolve(true);
    }
    directoryExist(dirPath) {
        return Promise.resolve(true);
    }
    fileExist(filePath) {
        return new Promise((fulfill, reject) => {
            this.client.getFile(this.containerName, filePath, (err, result) => {
                if (err) {
                    fulfill(false);
                }
                else {
                    fulfill(true);
                }
            });
        });
    }
    copy(streamSrc, streamDest) {
        return new Promise((fulfill, reject) => {
            streamSrc.on('error', (err) => {
                reject(err);
            });
            streamDest.on('error', (err) => {
                reject(err);
            });
            streamSrc.on('finish', function () {
            });
            streamDest.on('finish', function () {
                fulfill(true);
            });
            streamSrc.pipe(streamDest);
        });
    }
}
exports.RackspaceGateway = RackspaceGateway;
