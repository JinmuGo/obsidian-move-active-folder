import { type App, type FuzzyMatch, FuzzySuggestModal, Notice, type TFolder } from "obsidian";
import { FolderService } from "../services/FolderService";

export class DestinationModal extends FuzzySuggestModal<TFolder> {
	folderToMove: TFolder;
	folderService: FolderService;

	constructor(app: App, folderToMove: TFolder) {
		super(app);
		this.folderToMove = folderToMove;
		this.folderService = new FolderService(app);
		this.setPlaceholder(`Move '${folderToMove.name}' to...`);
	}

	getItems(): TFolder[] {
		return this.folderService.getValidDestinations(this.folderToMove);
	}

	getItemText(item: TFolder): string {
		return item.isRoot() ? "/" : item.path;
	}

	renderSuggestion(match: FuzzyMatch<TFolder>, el: HTMLElement): void {
		el.classList.add("mod-complex");

		const content = el.createEl("div", { cls: "suggestion-content" });

		const name = match.item.isRoot() ? "/" : match.item.name;

		content.createEl("div", { text: name, cls: "suggestion-title" });

		const path = match.item.isRoot() ? "Vault Root" : match.item.path;

		content.createEl("div", { text: path, cls: "suggestion-note" });
	}

	onChooseItem(item: TFolder, _evt: MouseEvent | KeyboardEvent): void {
		void (async () => {
			try {
				await this.folderService.moveFolder(this.folderToMove, item);

				new Notice(`Moved '${this.folderToMove.name}' to '${item.isRoot() ? "Root" : item.path}'`);
			} catch (error) {
				console.error(error);

				if (error instanceof Error) {
					new Notice(`Failed to move folder: ${error.message}`);
				} else {
					new Notice(`Failed to move folder: ${String(error)}`);
				}
			}
		})();
	}
}
