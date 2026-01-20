import { App, TFile, TFolder } from "obsidian";
import { FolderService } from "../services/FolderService";

describe("FolderService", () => {
	let app: App;
	let service: FolderService;
	let rootFolder: TFolder;
	let parentFolder: TFolder;
	let targetFolder: TFolder;
	let childFolder: TFolder;
	let siblingFolder: TFolder;
	let activeFile: TFile;

	beforeEach(() => {
		app = new App();
		service = new FolderService(app);

		// Setup folder structure
		// Root
		// ├── Parent
		// │   └── Target (Move this!)
		// │       └── Child
		// └── Sibling

		rootFolder = new TFolder("/");
		parentFolder = new TFolder("Parent");
		parentFolder.parent = rootFolder;

		targetFolder = new TFolder("Parent/Target");
		targetFolder.parent = parentFolder;

		childFolder = new TFolder("Parent/Target/Child");
		childFolder.parent = targetFolder;

		siblingFolder = new TFolder("Sibling");
		siblingFolder.parent = rootFolder;

		activeFile = new TFile("Parent/Target/ActiveFile.md");
		activeFile.parent = targetFolder;

		(app.vault.getAllLoadedFiles as jest.Mock).mockReturnValue([
			rootFolder,
			parentFolder,
			targetFolder,
			childFolder,
			siblingFolder,
		]);
	});

	describe("getParentFolders", () => {
		test("should list all parent folders up to root (exclusive)", () => {
			const folders = service.getParentFolders(activeFile);

			// Expect Target and Parent
			expect(folders).toContain(targetFolder);
			expect(folders).toContain(parentFolder);

			// Should NOT include Root
			expect(folders).not.toContain(rootFolder);
		});

		test("should list folders in bottom-up order", () => {
			const folders = service.getParentFolders(activeFile);
			expect(folders[0]).toBe(targetFolder);
			expect(folders[1]).toBe(parentFolder);
		});
	});

	describe("getValidDestinations", () => {
		test("should exclude the folder itself", () => {
			const destinations = service.getValidDestinations(targetFolder);
			expect(destinations).not.toContain(targetFolder);
		});

		test("should exclude descendants (children)", () => {
			const destinations = service.getValidDestinations(targetFolder);
			expect(destinations).not.toContain(childFolder);
		});

		test("should exclude current parent (no-op)", () => {
			const destinations = service.getValidDestinations(targetFolder);
			expect(destinations).not.toContain(parentFolder);
		});

		test("should include siblings", () => {
			const destinations = service.getValidDestinations(targetFolder);
			expect(destinations).toContain(siblingFolder);
		});

		test("should include root", () => {
			const destinations = service.getValidDestinations(targetFolder);
			expect(destinations).toContain(rootFolder);
		});
	});

	describe("moveFolder", () => {
		test("should call fileManager.renameFile with correct new path", async () => {
			// Move Target to Sibling -> Sibling/Target
			await service.moveFolder(targetFolder, siblingFolder);

			expect(app.fileManager.renameFile).toHaveBeenCalledWith(targetFolder, "Sibling/Target");
		});

		test("should handle root destination correctly", async () => {
			// Move Target to Root -> /Target (or just "Target" in Obsidian path)
			await service.moveFolder(targetFolder, rootFolder);

			expect(app.fileManager.renameFile).toHaveBeenCalledWith(targetFolder, "Target");
		});

		test("should throw error if destination already exists", async () => {
			// Mock that "Sibling/Target" already exists
			(app.vault.getAbstractFileByPath as jest.Mock).mockReturnValue(new TFolder("Sibling/Target"));

			await expect(service.moveFolder(targetFolder, siblingFolder)).rejects.toThrow("already exists");
		});
	});
});
