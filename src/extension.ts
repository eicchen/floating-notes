import * as vscode from 'vscode';
import { FolderTreeProvider } from "./treeView";
import * as io_func from "./io_functions";
export function activate(context: vscode.ExtensionContext) {
	// Initialize extension folders 
	const dirPath =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined;
	if(dirPath !== undefined){
		io_func.fnInitialize(dirPath);
		console.log('Floating notes initialized');
		// vscode.window.showInformationMessage(`dirPath: ${dirPath}`);
	}else{
		vscode.window.showErrorMessage("No workspace open!");
		return;
	}

	const treeDataProvider = new FolderTreeProvider(dirPath);
	vscode.window.registerTreeDataProvider('noteOutline', treeDataProvider);

	// ------------- UI ------------- //
	// const newNote_button = vscode.window.createStatusBarItem(2, 10);
	// newNote_button.command = `floating-notes.newNote`;
	// newNote_button.text = `$(new-file) New Note`;
	// newNote_button.tooltip = `Creates a default note.`;
	// newNote_button.show();

	// context.subscriptions.push(newNote_button);


	// ------------- Commands ------------- //
	const newNote_cmd = vscode.commands.registerCommand('floating_notes.newNote', () => {
		io_func.createFile();
		treeDataProvider.refresh();
		vscode.window.showInformationMessage('New Note created!');
	});

	const refresh_cmd = vscode.commands.registerCommand('floating_notes.refreshView', () => {
		treeDataProvider.refresh();
	});

	context.subscriptions.push(newNote_cmd);
	context.subscriptions.push(refresh_cmd);
}

// This method is called when your extension is deactivated
export function deactivate() {}
