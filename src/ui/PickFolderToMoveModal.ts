import { type App, type FuzzyMatch, FuzzySuggestModal, type TFile, type TFolder } from "obsidian";
import { FolderService } from "../services/FolderService";
import { DestinationModal } from "./DestinationModal";

export class PickFolderToMoveModal extends FuzzySuggestModal<TFolder> {
	activeFile: TFile;
	folderService: FolderService;

	constructor(app: App, activeFile: TFile) {
		super(app);
		this.activeFile = activeFile;
		this.folderService = new FolderService(app);
		this.setPlaceholder("Select which folder to move...");
	}

	getItems(): TFolder[] {
		return this.folderService.getParentFolders(this.activeFile);
	}

	getItemText(item: TFolder): string {
		return item.path;
	}

	renderSuggestion(match: FuzzyMatch<TFolder>, el: HTMLElement): void {
		el.classList.add("mod-complex");
		const content = el.createEl("div", { cls: "suggestion-content" });
		content.createEl("div", { text: match.item.name, cls: "suggestion-title" });
		content.createEl("div", { text: match.item.path, cls: "suggestion-note" });
	}

	onChooseItem(item: TFolder, _evt: MouseEvent | KeyboardEvent): void {
		new DestinationModal(this.app, item).open();
	}
}
