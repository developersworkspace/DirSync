import * as fs from 'graceful-fs';
import { Gateway } from './base';
export declare class RackspaceGateway implements Gateway {
    private username;
    private apiKey;
    private region;
    private containerName;
    private client;
    constructor(username: string, apiKey: string, region: string, containerName: string);
    createDirectory(dirPath: any): Promise<Boolean>;
    listFileObjects(): Promise<string[]>;
    listFiles(): Promise<string[]>;
    getFileReadStream(filePath: string): Promise<any>;
    getFileWriteStream(filePath: string): Promise<any>;
    getFileComparator(filePath: string): Promise<string>;
    deleteFile(filePath: string): Promise<Boolean>;
    deleteDirectory(dirPath: string): Promise<Boolean>;
    directoryExist(dirPath: string): Promise<Boolean>;
    fileExist(filePath: string): Promise<Boolean>;
    copy(streamSrc: fs.ReadStream, streamDest: fs.WriteStream): Promise<{}>;
}
