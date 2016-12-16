declare namespace Stores {
	interface IStores {
		appState: Stores.IAppState;
		sections: Stores.ISections;
		bibliographyStore: Stores.IBibliographyStore;
	}

	import ISection = Models.ISection;
	import IFile = Models.IFile;
	interface ISections {
		sections: Array<Models.ISection>;
		contentSections: Array<Models.ISection>;
		getSectionsAsHTML: string;
		getSectionsAsText: string;
		addSection(type: number, title: string, text?: string, insertionMode?: number, files?: IFile[]): ISection;
		moveSection(oldIndex: number, newIndex: number): void;
		removeSection(section: Models.ISection): number;
		removeSectionByID(id: number, triggeredFromModel?: boolean): number;
		clearSections():void;
		loadSections(): void;
		findSectionByID(id: number): ISection;
	}

	interface IAppState {
		activeMenuItem: number;
		snackBarMessage: string;
		snackBarOpen: boolean;

		closeSnackBar(): void;
	}

	interface IBibliographyStore {
		bibItems: any[];
		toJSON(string: string): Object[];
		toHTML(JSON: Object[]): string;
		short(any: any): string;
		loadItems(): void;
	}
}
