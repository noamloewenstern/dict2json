# VSCode Extension dict2json

VSCode extension converting explicitly-defined `python-dict` to an `json-like python-dict`.

## Motivation

The intent of simplifing the process of; Copying a dict-type in python code, and then converting it to a json-type dict.

For example: logging a dict to the console, then I'd want to quickly use the output as a json. So instead of adding another line as json.dumps(dct), now it's possible to just run command to do the magic.

## Features

Select dict in code -> Command "dict2json" -> Converts to json-like dict.
![feature dict2json](https://github.com/NoamLoewenstern/dict2json/raw/main/images/feature-usage.png)

## Extension Settings

- `dict2json.pythonPath`: The Python path to use for running the dict2json script

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
