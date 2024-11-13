# Wallbash

Wallbash is a Visual Studio Code extension that automatically updates your theme based on wal's color palette.

## Features

- Automatically updates the theme when the color palette changes.
- Manual update command to refresh the theme.

## Installation

1. Install the extension from the Visual Studio Code Marketplace.
2. Configure the extension settings as needed.

## Configuration

Wallbash provides the following configuration options:

### `wallbash.autoUpdate`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable auto-update of the theme from wal's color palette.

By default, the `wallbash.autoUpdate` setting is enabled. This means that Wallbash will automatically update your theme whenever the color palette changes. If you prefer to disable this feature, you can do so by adding the following to your `settings.json` file:

```json
{
  "wallbash.autoUpdate": false
}

# Usage
### Manual Update
You can manually update the theme by running the Wallbash: Update command from the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS).

# Contributing
Contributions are welcome! Please open an issue or submit a pull request on GitHub.

# License
This project is licensed under the MIT License.

