import {Sections} from '../stores/sections';
import {AppState} from "../stores/appState";
import {BibliographyStore} from "../stores/bibliography";

type TCreateStores = () => Stores.IStores;

const createStore: TCreateStores = (): Stores.IStores => ({
	sections: new Sections(),
	appState: new AppState(),
	bibliographyStore: new BibliographyStore(),
});

export default createStore;
