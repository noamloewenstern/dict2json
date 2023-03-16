import * as vscode from 'vscode';
import * as which from 'which';
import * as fs from 'fs';
import path = require('path');

let _cachedConfig = vscode.workspace.getConfiguration('dict2json');
export const getConfig = ({ fromCache = true } = {}) => {
  if (!fromCache) {
    _cachedConfig = vscode.workspace.getConfiguration('dict2json');
  }
  return _cachedConfig;
};

export const getApiUrl = () => getConfig({ fromCache: false }).get('apiUrl') as string;

let _defaultPythonPath: string | null | undefined = undefined;
const getDefaultPythonPath = () => {
  if (_defaultPythonPath === undefined) {
    _defaultPythonPath = which.sync('python', { nothrow: true });
    if (_defaultPythonPath && !fs.existsSync(_defaultPythonPath)) {
      _defaultPythonPath = null;
    }
  }
  return _defaultPythonPath;
};
export const getPythonPath = ({ showError } = { showError: false }) => {
  const inner = () => {
    const configValue = getConfig({ fromCache: false }).get('pythonPath') as string;
    if (configValue === 'python') {
      const pythonPath = getDefaultPythonPath();
      return {
        pythonPath,
        error: pythonPath ? undefined : 'Python not found in PATH',
      };
    }
    if (!fs.existsSync(configValue)) {
      return {
        pythonPath: configValue,
        error: `Python path does not exist: ${configValue}`,
      };
    }
    return {
      pythonPath: configValue,
    };
  };

  const { pythonPath, error } = inner();
  if (showError && error) {
    vscode.window.showErrorMessage(
      `dict2json: Set Python Path in settings. Current settings invalid, default or setting pythonPath doesn't exist. Error: ${error}`,
    );
  }
  return {
    pythonPath,
    error,
  };
};

export const getPythonScriptFilepath = ({ showError } = { showError: false }) => {
  const pythonScriptPath = path.join(__dirname, '..', '..', 'pythonScripts', 'convert.py');
  if (!fs.existsSync(pythonScriptPath)) {
    if (showError) {
      vscode.window.showErrorMessage(
        'dict2json: Python Script File not found. Contact Developer (github.com/NoamLoewenstern)',
      );
    }
    return {
      pythonScriptPath,
      error: `Python Script File not found: ${pythonScriptPath}`,
    };
  }
  return { pythonScriptPath };
};
