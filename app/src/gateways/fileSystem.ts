import * as recursive from 'recursive-readdir';
import * as path from 'path';
import * as fs from 'fs';
import * as md5File from 'md5-file';

export class FileSystemGateway {

    constructor(private basePath: string) {

    }

    public createDirectory(dirPath): Boolean {
        let result: Boolean;

        dirPath = path.join(this.basePath, dirPath);

        let parts = dirPath.split(path.sep);
        for (let i = 1; i <= parts.length; i++) {
            this.mkdirSync(path.join.apply(null, parts.slice(0, i)));
        }

        result = true;

        this.log(`createDirectory('${dirPath}') => ${result}`);
        return result;
    }

    public listFiles(dirPath: string): Promise<string[]> {
        dirPath = path.join(this.basePath, dirPath);
        return new Promise((fulfill, reject) => {
            recursive(dirPath, (err: Error, files: string[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                fulfill(files.map(x => path.relative(dirPath, x)));
            });
        });
    }

    public getFileReadStream(filePath: string) {
        filePath = path.join(this.basePath, filePath);
        return fs.createReadStream(filePath);
    }

    public getFileWriteStream(filePath: string) {
        filePath = path.join(this.basePath, filePath);
        return fs.createWriteStream(filePath);
    }

    public getFileComparator(filePath: string): string {
        filePath = path.join(this.basePath, filePath);

        let result = (<any>md5File).sync(filePath);

        this.log(`getFileComparator('${filePath}') => ${result}`);

        return result;
    }

    public deleteFile(filePath: string) {
        filePath = path.join(this.basePath, filePath);

        this.log(`deleteFile('${filePath}')`);
        fs.unlinkSync(filePath);
    }


    public deleteDirectory(dirPath: string) {
        dirPath = path.join(this.basePath, dirPath);

        this.log(`deleteDirectory('${dirPath}')`);
        fs.unlinkSync(dirPath);
    }

    public directoryExist(dirPath: string): Boolean {
        let result: Boolean;

        dirPath = path.join(this.basePath, dirPath);

        try {
            fs.statSync(dirPath);
            result = true;
        } catch (e) {
            result = false;
        }

        this.log(`directoryExist('${dirPath}') => ${result}`);
        return result;
    }

    public fileExist(filePath: string): Boolean {
        let result: Boolean;

        filePath = path.join(this.basePath, filePath);

        try {
            fs.statSync(filePath);
            result = true;
        } catch (e) {
            result = false;
        }

        this.log(`fileExist('${filePath}') => ${result}`);
        return result;
    }

    private mkdirSync(dirPath): Boolean {
        let result: Boolean;

        try {
            fs.mkdirSync(dirPath);
            result = true;
        } catch (e) {
            result = false;
        }

        this.log(`mkdirSync('${dirPath}') => ${result}`);

        return result;
    }

    private log(message: string): void {
        console.log(message);
    }
}