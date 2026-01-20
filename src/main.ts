import { Plugin } from "obsidian";
import { PickFolderToMoveModal } from "./ui/PickFolderToMoveModal";

export default class MoveActiveFolderPlugin extends Plugin {
	onload() {
		this.addCommand({
			id: "move-folder-containing-current-file",
			name: "Move folder containing current file...",
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (activeFile) {
					if (!checking) {
						new PickFolderToMoveModal(this.app, activeFile).open();
					}
					return true;
				}
				return false;
			},
		});
	}

	onunload() {}
}
