// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FolderTreeProvider } from "./treeView";
import * as io_func from "./io_functions";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const dirPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if(dirPath !== undefined){
			// const rootPath = "/Users/donglemcsplongle/Documents/Coding/floating-notes/";
		io_func.fnInitialize(dirPath);
		console.log('Floating notes initialized');
		vscode.window.showInformationMessage(dirPath);
		const treeDataProvider = new FolderTreeProvider(dirPath);
		vscode.window.registerTreeDataProvider('note-outline', treeDataProvider);

		// Use the console to output diagnostic information (console.log) and errors (console.error)
		// This line of code will only be executed once when your extension is activated

	}else{
		vscode.window.showErrorMessage("No workspace open!");
	}

	const disposable = vscode.commands.registerCommand('floating-notes.newNote', () => {
		io_func.createFile()
		vscode.window.showInformationMessage('New Note created!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
