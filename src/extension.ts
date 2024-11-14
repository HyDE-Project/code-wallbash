/*
Special thanks to the author of the wal theme for the inspiration and the code
https://github.com/dlasagno/vscode-wal-theme
I managed to make it work somehow, but I'm not sure if it's the best way to do it.
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
let autoUpdateWatcher: chokidar.FSWatcher|null = null;


export function activate(context: vscode.ExtensionContext) {

	// Register the update command
	let disposable = vscode.commands.registerCommand('wallBash.update', populateColorThemes);
	context.subscriptions.push(disposable);

	// Start the auto update if enabled
	if(vscode.workspace.getConfiguration().get('wallBash.autoUpdate')) {
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

	// Toggle the auto update in real time when changing the extension configuration
	vscode.workspace.onDidChangeConfiguration(event => {
		if(event.affectsConfiguration('wallBash.autoUpdate')) {
			if(vscode.workspace.getConfiguration().get('wallBash.autoUpdate')) {
				if(autoUpdateWatcher === null) {
					autoUpdateWatcher = autoUpdate();
				}
			}
			else if(autoUpdateWatcher !== null) {
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


/**
 * Automatically updates the theme when the color palette changes
 * @returns The watcher for the color palette
 */
function autoUpdate(): chokidar.FSWatcher {
  // Watch for changes in the color palette of wal
  return chokidar.watch(walCachePath, { persistent: true }).on('change', () => {
    console.log('Detected change in wal color palette');
      fs.readFile(walCachePath, 'utf8', (err, data) => {
        if (err) {
        vscode.window.showErrorMessage(`Failed to read the color palette: ${err}`);
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
