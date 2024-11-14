# Wallbash

Visual Studio Extension to generate Theme Colors using Wallbash

## Features

- Automatically updates color pallette from Wallbash.
- Manual update command to refresh the theme.

## Installation

1. Install the extension from the Visual Studio Code Marketplace.
2. Copy `./wallbash/vscode.dcol` to you `~/.config/hyde/wallbash/Wall-Ways ` or `~/.config/hyde/wallbash/Wall-Dcol` directory.
3. run `Hyde reload` to update the color pallette.

## Configuration

Wallbash provides the following configuration options:

### `wallbash.autoUpdate`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable auto-update of the theme from wal's color palette.

By default, the `wallbash.autoUpdate` setting is enabled. This means that Wallbash will automatically update your theme whenever the color palette changes. If you prefer to disable this feature, you can do so by adding the following to your `settings.json` file:

# Usage

### Manual Update

You can manually update the theme by running the Wallbash: Update command from the Command Palette (Ctrl+Shift+P).

# Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

# License

This project is licensed under the GPL License.

# Acknowledgements

* Special thanks to the author of the vscode-wal-theme extension for the inspiration - https://github.com/dlasagno/vscode-wal-theme
* Thanks to Tittu for the wallbash template -  https://github.com/prasanthrangan/hyprdots/
