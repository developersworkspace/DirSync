import { Gateway } from './base';
import { MongoClient, Db } from 'mongodb';
import * as fs from 'graceful-fs';

export class RegistryGateway implements Gateway {


    constructor(private gateway: Gateway) {

    }

    public populateRegistry() {
        return this.gateway.listFileObjects().then((files: any[]) => {
            let database: Db;
            return MongoClient.connect('mongodb://localhost:27017/dir_sync').then((db: Db) => {
                database = db;
                return database.collection('files').remove({});
            }).then((result: any) => {
                return database.collection('files').insert(files);
            }).then((result: any) => {
                database.close();
                return true;
            });
        });
    }

    public createDirectory(dirPath): Promise<Boolean> {
        return this.gateway.createDirectory(dirPath);
    }

    public listFiles(): Promise<string[]> {
        let database: Db;
        return MongoClient.connect('mongodb://localhost:27017/dir_sync').then((db: Db) => {
            database = db;
            return database.collection('files').find({}).toArray();
        }).then((files: any[]) => {
            database.close();
            return files.map(x => x.name);
        });
    }

    public listFileObjects(): Promise<string[]> {
        return this.gateway.listFileObjects();
    }

    public getFileReadStream(filePath: string) {
        return this.gateway.getFileReadStream(filePath);
    }

    public getFileWriteStream(filePath: string) {
        return this.gateway.getFileWriteStream(filePath);
    }

    public getFileComparator(filePath: string): Promise<string> {
        let database: Db;
        return MongoClient.connect('mongodb://localhost:27017/dir_sync').then((db: Db) => {
            database = db;
            return database.collection('files').find({
                name: filePath
            }).toArray();
        }).then((files: any[]) => {
            database.close();
            return files[0].md5;
        });
    }

    public deleteFile(filePath: string): Promise<Boolean> {
        return this.gateway.deleteFile(filePath);
    }

    public deleteDirectory(dirPath: string): Promise<Boolean> {
        return this.gateway.deleteDirectory(dirPath);
    }

    public directoryExist(dirPath: string): Promise<Boolean> {
        return this.gateway.directoryExist(dirPath);
    }

    public fileExist(filePath: string): Promise<Boolean> {
        let database: Db;
        return MongoClient.connect('mongodb://localhost:27017/dir_sync').then((db: Db) => {
            database = db;
            return database.collection('files').find({
                name: filePath
            }).toArray();
        }).then((files: any[]) => {
            database.close();
            return files.length == 0 ? false : true;
        });
    }

    public copy(streamSrc: fs.ReadStream, streamDest: fs.WriteStream) {
        return this.gateway.copy(streamSrc, streamDest);
    }
}