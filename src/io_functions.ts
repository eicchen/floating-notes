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

const dir_path: string = __dirname + '/floating-notes';
const subdirs: string[] = ['notes', 'scratchpads'].map(name => path.join(dir_path, name));

async function fnInitialize() {
    //!clear folder for testing
    const release = await mutex.acquire();
    await fs.rm(dir_path, {recursive: true, force: true}); 
    console.log("Directory cleared!\n");

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
async function createFile(fileName:string = "note", fileType: string = "md", dirPath: string = subdirs[0]){
    const release = await mutex.acquire();
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
        await fs.writeFile(fullPath, "penis");
        console.log(`File added: ${fullPath}`);
    }   
    release();
}



if(require.main == module){
    fnInitialize();
    createFile();
    createFile();
}
