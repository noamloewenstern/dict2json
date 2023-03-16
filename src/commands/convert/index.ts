/*
Command: ConvertPythonDictToJson.
Purpose:
Take current selected text, and send it to a remote api url <some_url>.
Replace the Current selected text with results from api.
if success full - show popup message with according message.
if error - show error message, and log to console the log. */

import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { loggerChannel as logger } from '../../utils/logger';
import { isJson } from '../../utils/helpers';
import { getPythonPath, getPythonScriptFilepath } from '../../utils/config';

interface IConvertScriptResults {
  result: string;
  error: string;
  ['log_msg']: string;
}

async function convertDict2Json(text: string, { timeout } = { timeout: 5000 }) {
  const { error, pythonPath } = getPythonPath({ showError: true });
  if (error) {
    return;
  }
  if (!pythonPath) {
    logger.error('Python Path is not set. Please set it in the extension settings.');
    return;
  }
  // execute python script convert.py to convert dict to json
  return new Promise<{ error: string } | { output: string }>((resolve, reject) => {
    const { pythonScriptPath, error } = getPythonScriptFilepath({ showError: true });
    if (error) {
      reject(error);
      return;
    }

    const pythonProcess = child_process.spawn(pythonPath, [pythonScriptPath, text]);

    let stderr = '';
    let stdout = '';

    pythonProcess.stdout.on('data', data => {
      stdout += data;
    });

    pythonProcess.stderr.on('data', data => {
      stderr += data;
    });

    pythonProcess.on('close', code => {
      if (code === 1) {
        logger.error('Error Converting in convert.py script. Exited with code 1. ', stderr);
        vscode.window.showErrorMessage('dict2json: Error Converting. Open log for more info.');
        resolve({ error: stderr });
        return;
      }
      if (stderr) {
        try {
          const errResult = JSON.parse(stderr) as IConvertScriptResults;
          logger.error('Error Converting in convert.py script. ', errResult.error);
          vscode.window.showErrorMessage(
            `dict2json: Error Converting.\n${errResult.error}.\n${errResult.log_msg}.\nOpen log for more info.`,
          );
        } catch (err) {
          logger.error('Error Converting in convert.py script. ', stderr);
          vscode.window.showErrorMessage('dict2json: Error Converting. Open log for more info.');
        }
        resolve({ error: stderr });
        return;
      }
      try {
        const result = JSON.parse(stdout.trim()) as IConvertScriptResults;
        const resultJsonString = result.result;
        if (!resultJsonString) {
          logger.error('Error Converting Output From convert.py Script. result is empty. ', stdout);
          vscode.window.showErrorMessage('dict2json: Error Converting. Open log for more info.');
          resolve({ error: stdout });
          return;
        }
        resolve({ output: resultJsonString });
      } catch (err) {
        logger.error('Error Converting Output From convert.py Script. result is not a parseable-json. ', stdout);
        vscode.window.showErrorMessage('dict2json: Error Converting. Open log for more info.');
        resolve({ error: stdout });
      }
    });
    setTimeout(() => {
      reject(new Error('dict2json: Timeout Error!'));
    }, timeout);
  });
}
const isPotentialDict = (text: string) => {
  const trimmedText = text.trim();
  return trimmedText.startsWith('{') && trimmedText.endsWith('}');
};

const getText = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    const msg = 'No open text editor!';
    throw new Error(msg);
  }

  const selection = editor.selection;
  if (!selection) {
    const msg = 'No text selected!';
    throw new Error(msg);
  }
  const text = editor.document.getText(selection);
  validateText(text);
  return { editor, selection, text };
};

const validateText = (text: string) => {
  if (!text) {
    const msg = 'No text selected!';
    throw new Error(msg);
  }
  if (isJson(text)) {
    const msg = 'Selected text is already JSON';
    vscode.window.showInformationMessage(msg);
    throw new Error();
  }
  if (!isPotentialDict(text)) {
    const msg = 'Selected text is not a Python Dict!';
    throw new Error(msg);
  }
};

export async function convertPythonDictToJsonCommand() {
  const { editor, selection, text } = getText();

  const result = (await convertDict2Json(text))!;
  if ('error' in result) {
    return;
  }
  const jsonResult = result.output;
  logger.log(`input selected: ${text}\nconverted output: ${jsonResult}`);
  editor.edit(edit => {
    edit.replace(selection, jsonResult);
    vscode.window.showInformationMessage('dict2json: Success!');
  });
}
