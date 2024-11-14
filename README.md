# Wallbash

Visual Studio Extension to generate Theme Colors using Wallbash

## Features

- Automatically updates color pallette from Wallbash.
- Manual update command to refresh the theme.

## Installation

1. Install the extension from the Visual Studio Code Marketplace.
2. This extension will copy `./wallbash/vscode.dcol` to your `~/.config/hyde/wallbash/Wall-Ways` directory by default.

   > See: #wallBash.enableThemeMode
   >
3. run `Hyde reload` to update the color pallette.

## Configuration

Wallbash provides the following configuration options:

### `wallBash.autoUpdate`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Update colors when wallbash changes.

By default, the `wallBash.autoUpdate` setting is enabled. This means that Wallbash will automatically update your theme whenever the color palette changes. If you prefer to disable this feature, you can do so by adding the following to your `settings.json` file:

```json
{
    "wallBash.autoUpdate": false
}

```

### wallBash.enableThemeMode

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable Wallbash dynamic colors per wallpaper.

By default, the `wallBash.enableThemeMode` setting is disbaled. This means that Wallbash will automatically update your vscode colors whenever the color palette changes.
You might be wondering why you would want to enable this feature.

    By enabling the`wallBash.enableThemeMode` setting your favorite theme can ship a `vscode.dcol` file and you can use it to generate the theme colors.

```json
{
    "wallBash.enableThemeMode": true
}

```


# Usage

### Manual Update

You can manually update the theme by running the Wallbash: Update command from the Command Palette (Ctrl+Shift+P).

Please be sure to update any cache required. Run:

`Hyde reload` to update any missing cache files.

# TODO

* Enable Theme Mode by default if more themes are shipped with it.

# Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

# Acknowledgements

* Special thanks to the author of the vscode-wal-theme extension for the inspiration - https://github.com/dlasagno/vscode-wal-theme
* Thanks to Tittu for the wallbash template -  https://github.com/prasanthrangan/hyprdots/
