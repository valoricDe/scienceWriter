import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {IconButton} from "material-ui";
import {IconMenu} from "material-ui";
import {MenuItem} from "material-ui";
import {Divider} from "material-ui";
import {Avatar} from "material-ui";
import NewSectionComponent from "./content/newSectionComponent";
import SectionListComponent from "./content/sectionListComponent";
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {observable} from "mobx";
import {Sections} from "../stores/sections";

@observer
export default class Sidebar extends Component<Props.Content.ISidebar, void> {
	public render(): JSX.Element {
		const iconButtonElement = (
			<IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
				<MoreVertIcon color={'#999'} />
			</IconButton>
		);

		const rightIconMenu = (
			<IconMenu iconButtonElement={iconButtonElement}>
				<MenuItem>Edit</MenuItem>
				<MenuItem>Forward</MenuItem>
				<MenuItem>Delete</MenuItem>
			</IconMenu>
		);

		const match = this.props.sections.getSectionsAsText.match(/\S+/g);
		const wordCount = match ? match.length : 0;

		return (
			<div>
				<NewSectionComponent {...this.props} />
				<Divider />
				<SectionListComponent {...this.props} />
				<Divider />
				<MenuItem style={{fontSize: '11px'}}>You wrote {wordCount} words / approx. {(wordCount/400).toFixed(1)} pages</MenuItem>
				<MenuItem leftIcon={<Avatar style={{display: 'inline-flex'}}>A</Avatar>} rightIcon={rightIconMenu}>Menu Item</MenuItem>
			</div>
		);
	};
};
