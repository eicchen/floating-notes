import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

class FileNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly fullPath: string
    ) {
        super(label, collapsibleState);
        this.resourceUri = vscode.Uri.file(fullPath);
    }
}

export class FolderTreeProvider implements vscode.TreeDataProvider<FileNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<FileNode | undefined | void> = new vscode.EventEmitter<FileNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<FileNode | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined) {}

    getTreeItem(element: FileNode): vscode.TreeItem {
        return element;
    }

    getChildren(element?: FileNode): Thenable<FileNode[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No folder opened');
            return Promise.resolve([]);
        }

        const dirPath = element ? element.fullPath : this.workspaceRoot;
        return Promise.resolve(this.getFilesInDirectory(dirPath));
    }

    private getFilesInDirectory(dir: string): FileNode[] {
        if (!fs.existsSync(dir)) return [];

        return fs.readdirSync(dir).map(file => {
            console.log(file);
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            return new FileNode(
                file,
                stat.isDirectory() ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                fullPath
            );
        });
    }
}