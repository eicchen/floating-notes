import * as path from 'path';
import * as fs from 'fs/promises';
// const filetypes_notes: string[] = [
//     "txt",
//     "md",
// ];

// const filetypes_scratch: string[] = [
//     "py",
//     "ts",
// ];

//? can make it so you can add stuff?
const subdirs: string[] = ['notes', 'scratchfiles'];
export let dirPath: string;            //Path of floating-notes folder 
export let subdirPaths: string[];      //Path of subfolders in floating-notes for notes, scratchfiles

export async function fnInitialize(work_path: string, clearFolder_bool?:boolean) {
    dirPath = path.join(work_path, 'floating-notes'); 
    subdirPaths = subdirs.map(name => path.join(dirPath, name));
    console.log(subdirPaths);

    if(clearFolder_bool == true){
        //!clear folder for testing
        try{
            await clearFolder(dirPath);
            console.log(`${dirPath}\nDirectory cleared!\n`);
        }catch{
            console.error(`${dirPath}\nDirectory clear failed!\n`);
        }
    }

    await createSubdirectories(dirPath);

    for (let subdir of subdirPaths){
        await createSubdirectories(subdir);
    }
}
async function createSubdirectories(folderPath: string) {
    try {
        await fs.access(folderPath, fs.constants.R_OK | fs.constants.W_OK)
        console.log(`Folder exists: ${folderPath}`);
    }catch{
        try {
            await fs.mkdir(folderPath,{ recursive: true });
            console.log(`Created: ${folderPath}`);
        } catch (err) {
            console.error(`Failed to create ${folderPath}:`, err);
        }
    }
}

//? Defaults to creating a 'note.md' in the notes folder
export async function createFile(fileName: string = "note", fileType: string = "md", workPath: string = subdirPaths[0]){
    let fullPath = path.join(workPath, `${fileName}.${fileType}`);
    try{
        await fs.access(fullPath)

        let iter: number = 1;
        while(iter < 100){
            fullPath = path.join(workPath, `${fileName}(${iter}).${fileType}`);
            await fs.access(fullPath);
            iter += 1;
        }
    } catch {
        await fs.writeFile(fullPath, "test text");
        console.log(`File added: ${fullPath}`);
    }   
}

async function clearFolder(dirPath: string){
    await fs.rm(dirPath, {recursive: true, force: true}); 
}

if (require.main === module) {
    (async () => {
        const test_path: string = path.join(__dirname, '..', 'test_folder');
        
        await fnInitialize(test_path, true);
        await createFile();
        await createFile();
    })().catch(err => {
        console.error('Error during initialization:', err);
    });
}
