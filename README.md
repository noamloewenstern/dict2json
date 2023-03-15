# Python Dict2Json

VSCode extension converting explicitly-defined *python-dict*  to an _json-like_ explicitly-defined python-dict*.

## Motivation
Copying a dict-type in python code, to convert to a json-type dict.
For example: logging a dict to the console, then wan't quickly use a json, instead of adding another line as json.dumps(dct), just run command in vscode which does it for you...

## Features
Select dict in code -> Command "dict2json" -> Converts to json-like dict-object.
![feature dict2json](images/feature-usage.gif)

## Extension Settings
* `dict2json.api_url`: set the remote api url used to convert the dict to json. (basictly [pythondict2json](https://github.com/NoamLoewenstern/pythondict2json/))
## Usage

1. Select some text (Python dict)
2. Open the command palette (Ctrl+Shift+P on Windows/Linux, Cmd+Shift+P on macOS)
3. Search for "dict2json: Convert Python-Dict To Json" (or just dict2json) and press Enter
4. The extension will convert the python-dict to json-dict (if not invalid selected text)

## Release Notes
### 0.1.1
Initial release.

# Issues
Please report any issues you encounter on the [GitHub issues page](https://github.com/NoamLoewenstern/dict2json/issues).
