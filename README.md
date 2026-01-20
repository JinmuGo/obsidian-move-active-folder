# Move Active Folder

Move the folder containing the currently active file.

## How to use

1. Open a note in Obsidian.
2. Run the command: **`Move folder containing current file...`**
3. Select which folder you want to move (e.g., the direct parent or an ancestor folder).
4. Select the destination folder.

## Features

- **Contextual Selection**: Lists all parent folders of the current file, allowing you to choose exactly what scope to move.
- **Validation**: Prevents moving a folder into itself or its own subfolders (circular move).
- **Safety**: Checks for duplicate folder names in the destination before moving.

## Installation

### Manual Installation

1. Download or clone this repository into your vault's plugins folder:
    ```bash
    git clone https://github.com/JinmuGo/obsidian-move-active-folder .obsidian/plugins/obsidian-move-active-folder
    ```
2. In Obsidian, go to **Settings → Community Plugins** and enable **Move Active Folder**.
3. Reload Obsidian if the plugin doesn't appear immediately.

### Via Community Plugins (BRAT)

You can use [BRAT (Beta Reviewer's Auto-update Tool)](https://github.com/TfTHacker/obsidian42-brat) to install this plugin before it becomes publicly listed:

1. Install the **BRAT** plugin from Obsidian's Community Plugins.
2. Go to `BRAT` settings → Click **"Add a beta plugin"**.
3. Paste the following GitHub repo URL: https://github.com/JinmuGo/obsidian-move-active-folder
4. Click **Install** and **Enable** the plugin!

## Contributing

Contributions, issues, and feature requests are welcome! Please check out the [issues page](https://github.com/JinmuGo/obsidian-move-active-folder/issues) or open a [pull request](https://github.com/JinmuGo/obsidian-move-active-folder/pulls)

## License

This project is licensed under the 0BSD License. See [LICENSE](LICENSE) for details.