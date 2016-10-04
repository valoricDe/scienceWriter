import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import Content from '../content';

import createStores from '../../main/create-stores';

describe('Content component', () => {
	const stores: Stores.IStores = createStores();
	const content: ShallowWrapper<Props.Content.IContent, {}> = shallow((<Content {...stores} />));

	const button: ShallowWrapper<any, {}> = content.find('Button');
	const increment: ShallowWrapper<any, {}> = button.at(0);
	const decrement: ShallowWrapper<any, {}> = button.at(1);

	describe('render components', () => {
		it('content', () => {
			expect(content.find('div').at(0).hasClass('content')).toBeTruthy();
		});

		it('center', () => {
			expect(content.children().name()).toBe('Center');
		});

		it('label output', () => {
			expect(content.find('Label').props().value).toBe(0);
		});

		it('increment button', () => {
			expect(increment.props().caption).toBe('++');
		});

		it('decrement button', () => {
			expect(decrement.props().caption).toBe('--');
		});
	});

	describe('component events', () => {
		it('increment button', () => {
			increment.simulate('click');

			expect(content.find('Label').props().value).toBe(1);
		});

		it('decrement button', () => {
			decrement.simulate('click');
			decrement.simulate('click');

			expect(content.find('Label').props().value).toBe(-1);
		});
	});
});
