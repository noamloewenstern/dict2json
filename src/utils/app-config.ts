import * as vscode from 'vscode';

let _cachedConfig = vscode.workspace.getConfiguration('dict2json');
export const getConfig = ({ fromCache = true } = {}) => {
  if (!fromCache) {
    _cachedConfig = vscode.workspace.getConfiguration('dict2json');
  }
  return _cachedConfig;
};

export const getApiUrl = () => getConfig({ fromCache: false }).get('apiUrl') as string;
