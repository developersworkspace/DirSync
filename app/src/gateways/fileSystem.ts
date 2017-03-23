import * as recursive from 'recursive-readdir';
import * as path from 'path';
import * as fs from 'graceful-fs';
import * as md5File from 'md5-file';

export class FileSystemGateway {

    constructor(private basePath: string) {

    }

    public createDirectory(dirPath): Promise<Boolean> {
        dirPath = this.formatAndBuildFullPath(dirPath);

        let parts = dirPath.split(path.sep);
        for (let i = 1; i <= parts.length; i++) {
            this.mkdirSync(path.join.apply(null, parts.slice(0, i)));
        }

        return Promise.resolve(true);
    }

    public listFiles(): Promise<string[]> {
        return new Promise((fulfill, reject) => {
            recursive(this.basePath, (err: Error, files: string[]) => {
                if (err) {
                    reject(err);
                } else {
                    fulfill(files.map(x => path.relative(this.basePath, x).replace(path.sep, '/')));
                }
            });
        });
    }

    public getFileReadStream(filePath: string) {
        filePath = this.formatAndBuildFullPath(filePath);
        return Promise.resolve(fs.createReadStream(filePath));
    }

    public getFileWriteStream(filePath: string) {
        filePath = this.formatAndBuildFullPath(filePath);
        return Promise.resolve(fs.createWriteStream(filePath));
    }

    public getFileComparator(filePath: string): Promise<string> {
        filePath = this.formatAndBuildFullPath(filePath);

        let result = (<any>md5File).sync(filePath);

        return Promise.resolve(result);
    }

    public deleteFile(filePath: string): Promise<Boolean> {
        filePath = this.formatAndBuildFullPath(filePath);
        fs.unlinkSync(filePath);

        return Promise.resolve(true);
    }

    public deleteDirectory(dirPath: string): Promise<Boolean> {
        dirPath = this.formatAndBuildFullPath(dirPath);
        fs.unlinkSync(dirPath);

        return Promise.resolve(true);
    }

    public directoryExist(dirPath: string): Promise<Boolean> {
        dirPath = this.formatAndBuildFullPath(dirPath);

        try {
            fs.statSync(dirPath);
            return Promise.resolve(true);
        } catch (e) {
            return Promise.resolve(false);
        }
    }

    public fileExist(filePath: string): Promise<Boolean> {
        filePath = this.formatAndBuildFullPath(filePath);

        try {
            fs.statSync(filePath);
            return Promise.resolve(true);
        } catch (e) {
            return Promise.resolve(false);
        }
    }

    private mkdirSync(dirPath): Boolean {
        let result: Boolean;

        try {
            fs.mkdirSync(dirPath);
            result = true;
        } catch (e) {
            result = false;
        }

        return result;
    }

    private formatAndBuildFullPath(filePath: string) {
        filePath = path.join(this.basePath, filePath);
        filePath = filePath.replace('/', path.sep);

        return filePath;
    }
}