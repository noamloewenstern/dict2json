// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { convertPythonDictToJsonCommand } from './convert';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // register command for convert python dict to json
  let disposable = vscode.commands.registerCommand('dict2json.convertPythonDictToJson', convertPythonDictToJsonCommand);
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
