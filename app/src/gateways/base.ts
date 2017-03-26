export interface Gateway {
    createDirectory(dirPath): Promise<Boolean>;
    listFiles(): Promise<string[]>;
    listFileObjects(): Promise<any[]>;
    getFileReadStream(filePath: string);
    getFileWriteStream(filePath: string);
    getFileComparator(filePath: string): Promise<string>;
    deleteFile(filePath: string): Promise<Boolean>;
    deleteDirectory(dirPath: string): Promise<Boolean>;
    directoryExist(dirPath: string): Promise<Boolean>;
    fileExist(filePath: string): Promise<Boolean>;
    copy(streamSrc: any, streamDest: any): Promise<Boolean>;
}