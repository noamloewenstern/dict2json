import * as vscode from 'vscode';

class OutputChannel {
  private channel: vscode.OutputChannel;

  constructor(name: string) {
    this.channel = vscode.window.createOutputChannel(name);
  }

  public log(...args: any[]): void {
    const message = args.map(arg => String(arg)).join(' ');
    this.channel.appendLine(message);
  }

  public error(...args: any[]): void {
    const message = args.map(arg => String(arg)).join(' ');
    this.channel.appendLine(`[ERROR] ${message}`);
  }
}

export const loggerChannel = new OutputChannel('dict2json');
