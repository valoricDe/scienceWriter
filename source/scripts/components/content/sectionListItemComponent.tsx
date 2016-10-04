import * as React from 'react';
import {action, observable} from "mobx";
import {observer, inject} from "mobx-react";
import IApp = Props.IApp;
import {IconButton} from "material-ui";
import {IconMenu} from "material-ui";
import {MenuItem} from "material-ui";
import {ListItem} from "material-ui";
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ISection = Models.ISection;
import ISectionListItem = Props.Content.ISectionListItem;
import {SectionTypeMap, SectionTypes} from "../../models/section";
import {Dialog} from "material-ui";
import {FlatButton} from "material-ui";
import {TextField} from "material-ui";
import {DropDownMenu} from "material-ui";

@observer
export default class SectionListItem extends React.Component<ISectionListItem, {}> {
	@observable sectionDialogOpen = false;
	@observable sectionType;
	@observable title = '';
	textField;

	constructor(props) {
		super(props);
		this.sectionType = this.props.section.type;
		this.title = this.props.section.title ? this.props.section.title : '';
	}

	@action onSectionMenuTap = () => {
		this.props.appState.activeMenuItem = this.props.section.id;
	};

	@action saveSection = () => {
		this.props.section.type = this.sectionType;
		this.props.section.title = this.title;
		this.closeSectionDialog();
	};

	@action removeSection = () => {
		this.props.sections.removeSectionByID(this.props.section.id)
	};

	openSectionDialog = () => {
		this.sectionDialogOpen = true;
		this.sectionType = this.props.section.type;
		setTimeout(() => {
			this.textField.focus();
		}, 0);
	};

	closeSectionDialog = () => {
		this.sectionDialogOpen = false;
	};

	submitSectionDialog = (event) => {
		this.saveSection();
		event.preventDefault();
		return false;
	};

	@action updateTitle = (event, value?: string) => {
		this.title = value;
	};

	@action updateSectionType = (event, value) => {
		this.sectionType = value;
	};

	public render(): JSX.Element {
		const iconButtonElement = (
			<IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
				<MoreVertIcon color={'#999'} />
			</IconButton>
		);

		const rightIconMenu = (
			<IconMenu iconButtonElement={iconButtonElement}>
				<MenuItem onTouchTap={this.openSectionDialog}>Edit</MenuItem>
				<MenuItem onTouchTap={this.removeSection}>Delete</MenuItem>
			</IconMenu>
		);

		const sectionDialogActions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.closeSectionDialog}
			/>,
			<FlatButton
				label="Save"
				disabled={this.title.length == 0}
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.saveSection}
			/>,
		];

		const value: ISection = this.props.section;

		return (
			<div>
				<ListItem onTouchTap={this.onSectionMenuTap} rightIconButton={rightIconMenu} key={value.id} title={value.title} primaryText={value.title} />
				<Dialog
					title={"Edit "+SectionTypeMap[value.type]}
					actions={sectionDialogActions}
					modal={false}
					open={this.sectionDialogOpen}
					onRequestClose={this.closeSectionDialog}>
					<form onSubmit={this.submitSectionDialog}>
						<DropDownMenu value={this.sectionType} onChange={this.updateSectionType}>
							{SectionTypeMap.map((name, index) => {
								return <MenuItem key={index} value={index} primaryText={name} />
							})}
						</DropDownMenu>
						<TextField
							ref={ (c) => { this.textField = c } }
							errorText="This field is required"
							floatingLabelText={SectionTypeMap[this.sectionType]+" title"}
							onChange={this.updateTitle}
							value={this.title}
						/>
					</form>
				</Dialog>
			</div>
		);
	}
}
