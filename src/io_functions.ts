import * as path from 'path';
import * as fs from 'fs/promises';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

// const filetypes_notes: string[] = [
//     "txt",
//     "md",
// ];

// const filetypes_scratch: string[] = [
//     "py",
//     "ts",
// ];

//TODO change default dir_path
let dir_path: string = __dirname + '/floating-notes';
let subdirs: string[] = ['notes', 'scratchpads'].map(name => path.join(dir_path, name));

export async function fnInitialize(work_path?: string) {
    //!clear folder for testing
    const release = await mutex.acquire();
    if(work_path){
        dir_path = path.join(work_path, 'floating-notes'); 
        subdirs = ['notes', 'scratchpads'].map(name => path.join(dir_path, name));
        console.log(work_path);

    }

    await fs.rm(dir_path, {recursive: true, force: true}); 
    console.log(`${dir_path}\nDirectory cleared!\n`);

    await createSubdirectories();

    release();
}
async function createSubdirectories() {
    for (const fullPath of subdirs) {
        try {
            await fs.access(fullPath, fs.constants.R_OK)
            console.log(`Folder exists: ${fullPath}`);
        }catch{
            try {
                await fs.mkdir(fullPath,{ recursive: true });
                console.log(`Created: ${fullPath}`);
            } catch (err) {
                console.error(`Failed to create ${fullPath}:`, err);
            }
        }
    }
}

//? Defaults to creating a 'note.md' in the notes folder
export async function createFile(fileName:string = "note", fileType: string = "md", dirPath: string = subdirs[0]){
    // const release = await mutex.acquire();
    let fullPath = path.join(dirPath, `${fileName}.${fileType}`);
    // let fullPath = path.join(dirPath, fileName, '.', fileType);
    try{
        await fs.access(fullPath)

        let iter: number = 1;
        while(iter < 10){
            fullPath = path.join(dirPath, `${fileName}(${iter}).${fileType}`);
            await fs.access(fullPath);
            iter += 1;
        }
    } catch {
        await fs.writeFile(fullPath, "test text");
        console.log(`File added: ${fullPath}`);
    }   
    // release();
}



if(require.main == module){
    fnInitialize();
    createFile();
    createFile();
}
