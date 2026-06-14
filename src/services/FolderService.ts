import type { App, TFile, TFolder } from "obsidian";

export class FolderService {
	app: App;

	constructor(app: App) {
		this.app = app;
	}

	/**
	 * Returns a list of parent folders for the given file, up to (but not including) the root.
	 * Ordered from closest parent to furthest.
	 */
	getParentFolders(file: TFile): TFolder[] {
		const folders: TFolder[] = [];
		let current = file.parent;

		while (current && !current.isRoot()) {
			folders.push(current);
			current = current.parent;
		}

		return folders;
	}

	/**
	 * Returns all valid destination folders for the given folder to move to.
	 * Filters out:
	 * 1. The folder itself.
	 * 2. The folder's current parent (no-op).
	 * 3. Any descendants of the folder (circular move).
	 */
	getValidDestinations(folderToMove: TFolder): TFolder[] {
		// Enumerate only folders (including the root) rather than every file in the
		// vault, so the plugin touches just the folder paths it needs as destinations.
		return this.app.vault.getAllFolders(true).filter((folder) => this.isValidDestination(folderToMove, folder));
	}

	private isValidDestination(folderToMove: TFolder, target: TFolder): boolean {
		// Cannot be the folder itself
		if (target.path === folderToMove.path) return false;

		// Cannot be the current parent (it's already there)
		const currentParentPath = folderToMove.parent?.path || "/";
		const targetPath = target.path === "/" ? "/" : target.path;
		if (targetPath === currentParentPath) return false;

		// Cannot be a descendant of the folder to move
		if (target.path.startsWith(`${folderToMove.path}/`)) return false;

		return true;
	}

	/**
	 * Moves the source folder to the destination folder.
	 * Throws an error if a folder with the same name already exists in the destination.
	 */
	async moveFolder(folder: TFolder, destination: TFolder): Promise<void> {
		const newParentPath = destination.path;
		const folderName = folder.name;

		// Construct the new path. If root, just folderName. Else parentPath + / + folderName
		const newPath = destination.isRoot() ? folderName : `${newParentPath}/${folderName}`;

		const existingFile = this.app.vault.getAbstractFileByPath(newPath);
		if (existingFile) {
			throw new Error(
				`A folder or file named '${folderName}' already exists in '${destination.isRoot() ? "Root" : destination.path}'.`,
			);
		}

		await this.app.fileManager.renameFile(folder, newPath);
	}
}
