"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class RegistryGateway {
    constructor(gateway) {
        this.gateway = gateway;
    }
    populateRegistry() {
        return this.gateway.listFileObjects().then((files) => {
            let database;
            return mongodb_1.MongoClient.connect('mongodb://localhost:27017/dir_sync').then((db) => {
                database = db;
                return database.collection('files').remove({});
            }).then((result) => {
                return database.collection('files').insert(files);
            }).then((result) => {
                database.close();
                return true;
            });
        });
    }
    createDirectory(dirPath) {
        return this.gateway.createDirectory(dirPath);
    }
    listFiles() {
        let database;
        return mongodb_1.MongoClient.connect('mongodb://localhost:27017/dir_sync').then((db) => {
            database = db;
            return database.collection('files').find({}).toArray();
        }).then((files) => {
            database.close();
            return files.map(x => x.name);
        });
    }
    listFileObjects() {
        return this.gateway.listFileObjects();
    }
    getFileReadStream(filePath) {
        return this.gateway.getFileReadStream(filePath);
    }
    getFileWriteStream(filePath) {
        return this.gateway.getFileWriteStream(filePath);
    }
    getFileComparator(filePath) {
        let database;
        return mongodb_1.MongoClient.connect('mongodb://localhost:27017/dir_sync').then((db) => {
            database = db;
            return database.collection('files').find({
                name: filePath
            }).toArray();
        }).then((files) => {
            database.close();
            return files[0].md5;
        });
    }
    deleteFile(filePath) {
        return this.gateway.deleteFile(filePath);
    }
    deleteDirectory(dirPath) {
        return this.gateway.deleteDirectory(dirPath);
    }
    directoryExist(dirPath) {
        return this.gateway.directoryExist(dirPath);
    }
    fileExist(filePath) {
        let database;
        return mongodb_1.MongoClient.connect('mongodb://localhost:27017/dir_sync').then((db) => {
            database = db;
            return database.collection('files').find({
                name: filePath
            }).toArray();
        }).then((files) => {
            database.close();
            return files.length == 0 ? false : true;
        });
    }
    copy(streamSrc, streamDest) {
        return this.gateway.copy(streamSrc, streamDest);
    }
}
exports.RegistryGateway = RegistryGateway;
