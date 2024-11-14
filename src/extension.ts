/*
Special thanks to the author of the vscode wal theme for the inspiration and the code
https://github.com/dlasagno/vscode-wal-theme
I managed to make it work somehow, but I'm not sure if it's the best way to do
it.
- khing
*/
import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

const walCachePath = path.join(
    os.homedir(), '.cache', 'hyde', 'landing', 'vscode-wallbash.json');
const targetPath = path.join(__dirname, '..', 'themes', 'wallbash.json');
const XDG_CONFIG_HOME =
    process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
let autoUpdateWatcher: chokidar.FSWatcher|null = null;

export function activate(context: vscode.ExtensionContext) {
  // Register the update command
  let disposable =
      vscode.commands.registerCommand('wallBash.update', populateColorThemes);
  context.subscriptions.push(disposable);

  initializeWallTemplates(
      vscode.workspace.getConfiguration().get('wallBash.enableThemeMode') ??
      false);

  // Start the auto update if enabled
  if (vscode.workspace.getConfiguration().get('wallBash.autoUpdate')) {
    /*
     * Update theme at startup
     * Needed for when wal palette updates while vscode isn't running.
     * The timeout is required to overcome a limitation of vscode which
     * breaks the theme auto-update if updated too early at startup.
     */
    // setTimeout(populateColorThemes, 5000);
    populateColorThemes();
    autoUpdateWatcher = autoUpdate();
  }

  // Toggle the auto update in real time when changing the extension
  // configuration
  vscode.workspace.onDidChangeConfiguration(event => {
    initializeWallTemplates(
        vscode.workspace.getConfiguration().get('wallBash.enableThemeMode') ??
        false);        
    if (event.affectsConfiguration('wallBash.autoUpdate')) {
      if (vscode.workspace.getConfiguration().get('wallBash.autoUpdate')) {
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
    }
  });
}

function initializeWallTemplates(enableThemeMode: boolean) {
  const templateSource = path.join(__dirname, '..', 'wallbash', 'vscode.dcol');
  const wallWaysDir =
      path.join(XDG_CONFIG_HOME, 'hyde', 'wallbash', 'Wall-Ways');
  const wallDcolDir =
      path.join(XDG_CONFIG_HOME, 'hyde', 'wallbash', 'Wall-Dcol');

  if (enableThemeMode) {
    console.log('Theme Mode enabled');
    vscode.window.showInformationMessage('Theme Mode enabled\nPlease refresh Theme manually');
    if (!fs.existsSync(wallDcolDir)) {
      vscode.window.showInformationMessage(
          'Wall-Dcol directory does not exist!\n Is HyDE installed?');
      return;
    }

    fs.copyFile(
        templateSource, path.join(wallDcolDir, 'vscode.dcol'), (err) => {
          if (err) {
            vscode.window.showErrorMessage(
                `Failed to copy the template: ${err}`);
          }
        });
    if (fs.existsSync(path.join(wallWaysDir, 'vscode.dcol'))) {
      fs.unlink(path.join(wallWaysDir, 'vscode.dcol'), (err) => {
        if (err) {
          vscode.window.showErrorMessage(`Failed to remove the file: ${err}`);
        }
      });
    }

  } else {
    console.log('Dynamic Wallpaper Mode enabled');
    vscode.window.showInformationMessage('Dynamic Mode enabled\nPlease refresh Theme/Wallpaper manually');
    if (!fs.existsSync(wallWaysDir)) {
      vscode.window.showInformationMessage(
          'Wall-Ways directory does not exist!\n Is HyDE installed?');
      return;
    }

    fs.copyFile(
        templateSource, path.join(wallWaysDir, 'vscode.dcol'), (err) => {
          if (err) {
            vscode.window.showErrorMessage(
                `Failed to copy the template: ${err}`);
          }
        });

    if (fs.existsSync(path.join(wallDcolDir, 'vscode.dcol'))) {
      fs.unlink(path.join(wallDcolDir, 'vscode.dcol'), (err) => {
        if (err) {
          vscode.window.showErrorMessage(`Failed to remove the file: ${err}`);
        }
      });
    }
  }
}


/**
 * Automatically updates the theme when the color palette changes
 * @returns The watcher for the color palette
 */
function autoUpdate(): chokidar.FSWatcher {
  // Watch for changes in the color palette of wal
  return chokidar.watch(walCachePath, {persistent: true}).on('change', () => {
    console.log('Detected change in wal color palette');
    fs.readFile(walCachePath, 'utf8', (err, data) => {
      if (err) {
        vscode.window.showErrorMessage(
            `Failed to read the color palette: ${err}`);
        return;
      }

      // Check if the data contains the pattern <wallbash_*>
      const pattern = /<wallbash_[^>]+>/;
      if (!pattern.test(data)) {
        populateColorThemes();
      } else {
        console.log('Dumb copy');
      }
    });
  });
}
