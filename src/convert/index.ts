/*
Command: ConvertPythonDictToJson.
Purpose:
Take current selected text, and send it to a remote api url <some_url>.
Replace the Current selected text with results from api.
if success full - show popup message with according message.
if error - show error message, and log to console the log. */

import * as vscode from 'vscode';
import axios, { AxiosError } from 'axios';
import { loggerChannel as logger } from '../utils/logger';
import { isJson } from '../utils/helpers';

const BASE_URL = 'https://pythondict2json-kwwxoeu7ra-uc.a.run.app';
const CONVERT_URL = BASE_URL + '/api/convert';

const convertAPI = (text: string) => {
  return axios.post<{ result: string }>(CONVERT_URL, {
    type: 'dict2json',
    data: text,
  });
};

export async function convertPythonDictToJsonCommand() {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No open text editor!');

    return; // No open text editor
  }

  let selection = editor.selection;
  if (!selection) {
    vscode.window.showErrorMessage('No text selected!');

    return; // No text selected
  }
  let text = editor.document.getText(selection);
  if (!text) {
    vscode.window.showErrorMessage('No text selected!');

    return; // No text selected
  }
  if (isJson(text)) {
    vscode.window.showInformationMessage('Selected text is already JSON!');
    return;
  }

  try {
    const result = await convertAPI(text);
    if (result.status === 200) {
      const { result: jsonText } = result.data;
      // log
      logger.log(`conversion: selection: ${text}\nconverted: ${jsonText}`);
      editor.edit(edit => {
        edit.replace(selection, jsonText);
      });
      vscode.window.showInformationMessage('dict2json: Success!');
    } else {
      logger.error('dict2json: Error!', result);
      vscode.window.showErrorMessage('dict2json: Error! Check Log for more info.');
    }
  } catch (error) {
    logger.error('dict2json: Error!', error);
    // check error type is axios error
    if (error instanceof AxiosError) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errMsg = {
        status: error?.response?.status,
        data: error?.response?.data,
        // headers: error?.response?.headers,
      } as any;
      // if any of the keys are not undefined, then log
      if (Object.keys(errMsg).some(key => errMsg[key] !== undefined)) {
        logger.error('dict2json: Request Error:', JSON.stringify(errMsg));
      }
    }
    vscode.window.showErrorMessage('dict2json: Error! Check Log for more info.');
  }
}
