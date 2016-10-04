import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import App from '../app';

import createStores from '../../main/create-stores';

describe('App component', () => {
	const stores: Stores.IStores = createStores();
	const app: ShallowWrapper<Props.IApp, {}> = shallow((<App {...stores} />));

	it('render app wrapper', () => {
		expect(app.find('div').at(0).hasClass('wrapper')).toBeTruthy();
	});
});
