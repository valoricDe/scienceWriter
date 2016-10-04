import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SectionComponent from "./content/sectionComponent";

@observer
export default class Content extends Component<Props.Content.IContent, void> {


	public render(): JSX.Element {
		var sections = this.props.sections.sections.map((s, i) => {
			return <SectionComponent key={s.id} index={i} section={s} {...this.props} />
		});

		return (
			<div className='content'>
				{sections}
			</div>
		);
	};
};
