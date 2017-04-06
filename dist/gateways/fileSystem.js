"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recursive = require("recursive-readdir");
const path = require("path");
const fs = require("graceful-fs");
const md5File = require("md5-file");
class FileSystemGateway {
    constructor(basePath) {
        this.basePath = basePath;
    }
    createDirectory(dirPath) {
        dirPath = this.formatAndBuildFullPath(dirPath);
        let parts = dirPath.split(path.sep);
        for (let i = 1; i <= parts.length; i++) {
            this.mkdirSync(path.join.apply(null, parts.slice(0, i)));
        }
        return Promise.resolve(true);
    }
    listFileObjects() {
        return null;
    }
    listFiles() {
        return new Promise((fulfill, reject) => {
            recursive(this.basePath, (err, files) => {
                if (err) {
                    reject(err);
                }
                else {
                    fulfill(files.map(x => path.relative(this.basePath, x).replace(path.sep, '/')));
                }
            });
        });
    }
    getFileReadStream(filePath) {
        filePath = this.formatAndBuildFullPath(filePath);
        return Promise.resolve(fs.createReadStream(filePath));
    }
    getFileWriteStream(filePath) {
        filePath = this.formatAndBuildFullPath(filePath);
        return Promise.resolve(fs.createWriteStream(filePath));
    }
    getFileComparator(filePath) {
        filePath = this.formatAndBuildFullPath(filePath);
        let result = md5File.sync(filePath);
        return Promise.resolve(result);
    }
    deleteFile(filePath) {
        filePath = this.formatAndBuildFullPath(filePath);
        fs.unlinkSync(filePath);
        return Promise.resolve(true);
    }
    deleteDirectory(dirPath) {
        dirPath = this.formatAndBuildFullPath(dirPath);
        fs.unlinkSync(dirPath);
        return Promise.resolve(true);
    }
    directoryExist(dirPath) {
        dirPath = this.formatAndBuildFullPath(dirPath);
        try {
            fs.statSync(dirPath);
            return Promise.resolve(true);
        }
        catch (e) {
            return Promise.resolve(false);
        }
    }
    fileExist(filePath) {
        filePath = this.formatAndBuildFullPath(filePath);
        try {
            fs.statSync(filePath);
            return Promise.resolve(true);
        }
        catch (e) {
            return Promise.resolve(false);
        }
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
                console.log('END SRC');
            });
            streamDest.on('finish', function () {
                console.log('END DEST');
                fulfill(true);
            });
            streamSrc.pipe(streamDest);
        });
    }
    mkdirSync(dirPath) {
        let result;
        try {
            fs.mkdirSync(dirPath);
            result = true;
        }
        catch (e) {
            result = false;
        }
        return result;
    }
    formatAndBuildFullPath(filePath) {
        filePath = path.join(this.basePath, filePath);
        filePath = filePath.replace('/', path.sep);
        return filePath;
    }
}
exports.FileSystemGateway = FileSystemGateway;
