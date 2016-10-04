import createStores from '../create-stores';

import {Sections} from "../../stores/sections";
import {AppState} from "../../stores/appState";
import {BibliographyStore} from "../../stores/bibliography";

describe('Create stores', () => {
	const all: Stores.IStores = {
		sections: new Sections(),
		appState: new AppState(),
		bibliographyStore: new BibliographyStore(),
	};

	it('should return all stores', () => {
		const stores: Stores.IStores = createStores();

		expect(stores).toEqual(all);
	});
});
