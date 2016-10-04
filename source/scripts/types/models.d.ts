declare namespace Models {
	export interface ISection {
		store: Stores.ISections;
		id: number;
		index: number;
		title: string;
		type: number;
		text: string;
		files: IFile[];
		subsections: ISubSection[];
		toJSON: Object;
		toHTML: string;
		remove(triggeredFromStore): void;
	}

	interface IFile {
		type: number;
		file: File;
	}

	interface ISubSection {
		id: string
		title: string
		num: string
	}
}
