import * as vscode from 'vscode';
// import * as path from 'path';
// import * as fs from 'fs';
import { FolderTreeProvider } from "./treeView";
import * as io_func from "./io_functions";
export async function activate(context: vscode.ExtensionContext) {
	// Initialize extension folders 
	let debug_toggle = true;   // eslint-disable-line 
	let treeDataProviderList: FolderTreeProvider[] = [];

	const dirPath =  vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined;

	if(!dirPath){
		vscode.window.showErrorMessage("No workspace open!");
		return;
	}
	
	await io_func.fnInitialize(dirPath, debug_toggle);
	console.log('Floating notes initialized');
	treeDataProviderList = io_func.subdirPaths.map(x => new FolderTreeProvider(x));

	if(treeDataProviderList.length >= 2) { 
		vscode.window.registerTreeDataProvider('fn-notes', treeDataProviderList[0]);
		vscode.window.registerTreeDataProvider('fn-scratch', treeDataProviderList[1]);
	}else{
		vscode.window.showErrorMessage("Not enough subfolders found in floating-notes");
	}

	for (let iter of treeDataProviderList){
		iter.refresh();
	}

	// ------------- UI ------------- //
	// const newNote_button = vscode.window.createStatusBarItem(2, 10);
	// newNote_button.command = `floating-notes.newNote`;
	// newNote_button.text = `$(new-file) New Note`;
	// newNote_button.tooltip = `Creates a default note.`;
	// newNote_button.show();

	// context.subscriptions.push(newNote_button);


	// ------------- Commands ------------- //
	const newNote_cmd = vscode.commands.registerCommand('floating-notes.newNote', () => {
		let noteArgs = ["note", "md", io_func.subdirPaths[0]];
		io_func.createFile(...noteArgs);
		treeDataProviderList[0].refresh();
	});
	const newScratch_cmd = vscode.commands.registerCommand('floating-notes.newScratch', () => {
		//TODO add checks and drop down to configure scratch type
		let scratchArgs = ["scratch", "py", io_func.subdirPaths[1]];
		io_func.createFile(...scratchArgs);
		treeDataProviderList[1].refresh();
	});

	const refresh_cmd = vscode.commands.registerCommand('floating-notes.refreshView', () => {
		treeDataProviderList[0].refresh();
		treeDataProviderList[1].refresh();
	});

	context.subscriptions.push(newNote_cmd);
	context.subscriptions.push(refresh_cmd);
}

export function deactivate() {}
