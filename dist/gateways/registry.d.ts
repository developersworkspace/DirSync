import { Gateway } from './base';
import * as fs from 'graceful-fs';
export declare class RegistryGateway implements Gateway {
    private gateway;
    constructor(gateway: Gateway);
    populateRegistry(): Promise<boolean>;
    createDirectory(dirPath: any): Promise<Boolean>;
    listFiles(): Promise<string[]>;
    listFileObjects(): Promise<string[]>;
    getFileReadStream(filePath: string): any;
    getFileWriteStream(filePath: string): any;
    getFileComparator(filePath: string): Promise<string>;
    deleteFile(filePath: string): Promise<Boolean>;
    deleteDirectory(dirPath: string): Promise<Boolean>;
    directoryExist(dirPath: string): Promise<Boolean>;
    fileExist(filePath: string): Promise<Boolean>;
    copy(streamSrc: fs.ReadStream, streamDest: fs.WriteStream): Promise<Boolean>;
}
