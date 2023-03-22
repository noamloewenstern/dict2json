import json
from ast import literal_eval
import sys
from typing import TypedDict, Union
from argparse import ArgumentParser


class ErrorResult(TypedDict):
    error: str
    log_msg: str


class SuccessResult(TypedDict):
    result: str


def convert_dict2json(data: str) -> Union[SuccessResult, ErrorResult]:
    if not data or not isinstance(data, str) \
            or not data.strip().startswith('{') or not data.strip().endswith('}'):
        return {
            "error": "Invalid data",
            "log_msg": f"Invalid data, input is not a dict. {data}"
        }

    try:
        data = data.strip()
        result = json.dumps(literal_eval(data), indent=4)
    except Exception as e:
        return {
            "error": "Error Converting. If Incorrect, Please Contact Developer (github dict2json)",
            "log_msg": f"Error Converting: {str(e)}"
        }
    return {
        "result": result
    }


def convert_json2dict(data: str) -> Union[SuccessResult, ErrorResult]:
    if not data or not isinstance(data, str) \
            or not data.strip().startswith('{') or not data.strip().endswith('}'):
        return {
            "error": "Invalid data Convert JSON to dict",
            "log_msg": f"Invalid data, input is not a Valid Json which can converted to dict. {data}"
        }

    try:
        data = data.strip()
        result = json.loads(data)
    except Exception as e:
        return {
            "error": "Error Converting. If Incorrect, Please Contact Developer (github dict2json)",
            "log_msg": f"Error Converting: {str(e)}"
        }

    return {
        "result": str(result)
    }


def get_args():
    parser = ArgumentParser()
    parser.add_argument("--command", required=True, help="command to run", choices=["dict2json", "json2dict"])
    parser.add_argument("data", help="data to convert")
    return parser.parse_args()


def main():
    try:
        args = get_args()
    except Exception as e:
        print(json.dumps({
            "error": "Error Parsing Arguments",
            "log_msg": f"Error Parsing Arguments: {str(e)}"
        }), file=sys.stderr)
        return
    # output will be read by the main program calling this script
    if args.command == "dict2json":
        result = convert_dict2json(args.data)
    elif args.command == "json2dict":
        result = convert_json2dict(args.data)
    else:
        result = {
            "error": "Error Command. Contact Developer (github dict2json)",
            "log_msg": "Error Command."
        }

    outfile = sys.stderr if 'error' in result else sys.stdout
    print(json.dumps(result), file=outfile)


if __name__ == "__main__":
    main()
