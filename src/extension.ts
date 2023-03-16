// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { convertPythonDictToJsonCommand } from './commands/convert';
import { getPythonPath, getPythonScriptFilepath } from './utils/config';
import { loggerChannel } from './utils/logger';

export const checkInitialPythonPath = () => {
  getPythonPath({ showError: true });
  getPythonScriptFilepath({ showError: true });
};

export function activate(context: vscode.ExtensionContext) {
  checkInitialPythonPath();

  let disposable = vscode.commands.registerCommand('dict2json.convertPythonDictToJson', convertPythonDictToJsonCommand);
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
