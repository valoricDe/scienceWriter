import * as React from 'react';
import {action} from "mobx";
import {observer, inject} from "mobx-react";
import SectionListItem from "./sectionListItemComponent";

const SortableContainer:Function = require('../../vendor/react-sortable-hoc/dist/commonjs/SortableContainer/index').default;
const SortableElement:Function = require('../../vendor/react-sortable-hoc/dist/commonjs/SortableElement/index').default;

@observer
export default class SectionListComponent extends React.Component<Props.IApp, {}> {

	@action onSortEnd = ({oldIndex, newIndex}) => {
		if(oldIndex != newIndex)
			setTimeout(() => {
				this.props.sections.moveSection(oldIndex, newIndex);
			});
	};

	public render(): JSX.Element {
		const SortableItem = SortableElement(({value}) => {
			return <SectionListItem key={value.id} section={value} {...this.props} />
		});

		const SortableList = SortableContainer(({items}) => {
			return (
				<div>
					{items.map((value, index) => {
						return <SortableItem key={value.id} index={index} value={value} />
					})}
				</div>
			);
		});

		let sections = this.props.sections.sections.map((s) => s);

		return <SortableList pressDelay={100} items={sections} onSortEnd={this.onSortEnd} helperClass="content__menusort" />;
	}
}
