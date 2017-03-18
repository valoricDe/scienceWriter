

declare namespace Props {
	interface IApp extends Stores.IStores {}

	namespace Content {
		interface ISidebar extends IApp {}
		interface IContent extends IApp {}

		import ISections = Stores.ISections;
		import ISection = Models.ISection;

		interface IButton {
			type: string;
			caption: string;
			onClick(): void;
		}

		interface ILabel {
			value: string | number;
		}

		interface ICSection {
			title: string;
			type: number;
			text?: string;
			id?: number;
			appState?: any;
			sections?: Stores.ISections;
		}

		interface ISectionListItem extends IApp{
			section: ISection;
		}

		interface ISectionComponent {
			appState?: any;
			sections?: Stores.ISections;
			bibliographyStore?: any;
			section: ISection;
			index: number;
		}

		interface IBibSectionComponent {
			appState?: any;
			sections?: Stores.ISections;
			bibliographyStore?: Stores.IBibliographyStore;
			section: ISection;
			index: number;
		}

		interface IMentionListItem {
			displayLabel: string,
			highlightIndex: number,
			index: number,
			onClick(index: number): void;
		}

		interface ISectionTinymce {
			sections?: Stores.ISections;
			bibliographyStore?: Stores.IBibliographyStore;
			onChange(text: string): void;
			section: ISection;
			index: number;
		}

		interface INewSectionComponent extends Stores.IStores {}
	}

	namespace Common {
		interface ICenter extends React.HTMLProps<HTMLDivElement> {}
	}
}
