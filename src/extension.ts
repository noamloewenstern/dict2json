// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { convertCommand } from './commands/convert';
import { getPythonPath, getPythonScriptFilepath } from './utils/config';

export const checkInitialPythonPath = () => {
  getPythonPath({ showError: true });
  getPythonScriptFilepath({ showError: true });
};

export function activate(context: vscode.ExtensionContext) {
  checkInitialPythonPath();

  let disposable = vscode.commands.registerCommand('dict2json.convertPythonDictToJson', convertCommand('dict2json'));
  context.subscriptions.push(disposable);
  disposable = vscode.commands.registerCommand('dict2json.convertJsonToPythonDict', convertCommand('json2dict'));
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
