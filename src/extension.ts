import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

const walCachePath = path.join(
    os.homedir(), '.cache', 'hyde', 'landing', 'vscode-wallbash.json');
const targetPath = path.join(__dirname, '..', 'themes', 'wallbash.json');
let autoUpdateWatcher: chokidar.FSWatcher|null = null;


export function activate(context: vscode.ExtensionContext) {
  console.log('Initializing!\n');
  console.log('walCachePath: \n', walCachePath);
  console.log('targetPath: \n', targetPath);


  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable =
      vscode.commands.registerCommand('wallbash.update', populateColorThemes);
  context.subscriptions.push(disposable);

  // Start the auto update if enabled
  if (vscode.workspace.getConfiguration().get('wallbash.autoUpdate')) {
    /*
     * Update theme at startup
     * Needed for when wal palette updates while vscode isn't running.
     * The timeout is required to overcome a limitation of vscode which
     * breaks the theme auto-update if updated too early at startup.
     */
    setTimeout(populateColorThemes, 10000);

    autoUpdateWatcher = autoUpdate();
  }

  // Toggle the auto update in real time when changing the extension
  // configuration
  vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('wallbash.autoUpdate')) {
      if (vscode.workspace.getConfiguration().get('wallbash.autoUpdate')) {
        if (autoUpdateWatcher === null) {
          autoUpdateWatcher = autoUpdate();
        }
      } else if (autoUpdateWatcher !== null) {
        autoUpdateWatcher.close();
        autoUpdateWatcher = null;
      }
    }
  });
}

export function deactivate() {
  // Close the watcher if active
  if (autoUpdateWatcher !== null) {
    autoUpdateWatcher.close();
  }
}

/**
 * Populates the color themes from the wal color palette
 */
function populateColorThemes() {
  // Basically will copy from cache to targetPath
  fs.copyFile(walCachePath, targetPath, (err) => {
    if (err) {
      vscode.window.showErrorMessage(
          `Failed to copy the color palette: ${err}`);
    } else {
      vscode.window.showInformationMessage(
          'Successfully updated the color palette');
    }
  });


}


/**
 * Automatically updates the theme when the color palette changes
 * @returns The watcher for the color palette
 */
function autoUpdate(): chokidar.FSWatcher {
  // Watch for changes in the color palette of wal
  return chokidar.watch(walCachePath).on('change', populateColorThemes);
}
