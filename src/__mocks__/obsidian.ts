export class TAbstractFile {
	path: string;
	name: string;
	parent: TFolder | null;

	constructor(path: string) {
		this.path = path;
		this.name = path.split("/").pop() || "";
		this.parent = null;
	}
}

export class TFile extends TAbstractFile {
	stat: any;
	basename: string;
	extension: string;

	constructor(path: string) {
		super(path);
		this.basename = this.name.split(".")[0];
		this.extension = this.name.split(".").pop() || "";
	}
}

export class TFolder extends TAbstractFile {
	children: TAbstractFile[] = [];

	isRoot(): boolean {
		return this.path === "/";
	}
}

export class App {
	vault: any;
	fileManager: any;
	constructor() {
		this.vault = {
			getAllLoadedFiles: jest.fn(),
			getAbstractFileByPath: jest.fn(),
		};
		this.fileManager = {
			renameFile: jest.fn(),
		};
	}
}

export class FuzzySuggestModal<_T> {
	app: App;
	constructor(app: App) {
		this.app = app;
	}
	setPlaceholder(_placeholder: string) {}
	open() {}
	close() {}
}

export class Notice {}

export class FuzzyMatch<T> {
	item: T;
	match: any;
}
