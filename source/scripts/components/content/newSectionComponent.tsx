import * as React from 'react';
import {observable, action} from "mobx";
import { observer, inject } from 'mobx-react';
import {MenuItem} from "material-ui";
import Dialog from "material-ui/Dialog";
import DropDownMenu from "material-ui/DropDownMenu";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import {SectionTypeMap, SectionTypes, default as Section} from "../../models/section";
import {IconButton} from "material-ui";
import {IconMenu} from "material-ui";
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {Checkbox} from "material-ui";
import {InsertionType, InsertionTypeMap} from "../../stores/sections";
import {downloadFile} from "../../library/downloadHelper";
const Dropzone = require('react-dropzone');
import {TouchTapEvent} from "material-ui";

@observer
export default class NewSectionComponent extends React.Component<Props.Content.INewSectionComponent, {}> {
	@observable addSectionDialogOpen = false;
	@observable importSectionDialogOpen = false;
	@observable insertionType = InsertionType.APPEND;
	@observable sectionType = SectionTypes.CHAPTER;
	@observable title = '';
	@observable text = '';
	@observable files = [];
	@observable overwriteExistingContent = false;
	textField;

	addSection = () => {
		this.props.sections.addSection(this.sectionType, this.title, this.text, this.insertionType, this.files);
		this.closeAddSectionDialog();
	};

	openAddSectionDialog = (e: TouchTapEvent, index: number, menuItemValue: any) => {
		this.addSectionDialogOpen = true;
		this.sectionType = menuItemValue;
		setTimeout(() => {
			this.textField.focus();
		}, 0);
	};

	closeAddSectionDialog = () => {
		this.addSectionDialogOpen = false;
	};

	openImportSectionDialog = () => {
		this.importSectionDialogOpen = true;
	};


	closeImportSectionDialog = () => {
		this.importSectionDialogOpen = false;
	};

	submitAddSectionDialog = (event) => {
		this.addSection();
		event.preventDefault();
		return false;
	};

	@action updateTitle = (event: React.SyntheticEvent<{}>, value?: string) => {
		this.title = value;
	};

	@action updateSectionType = (event, value) => {
		this.sectionType = value;
	};

	@action updateInsertionType = (event, value) => {
		this.insertionType = value;
	};

	onDropFile = (files) => {
		this.closeImportSectionDialog();
		var reader = new FileReader();

		reader.onloadend = () => {
			let fileDiv = document.createElement('div');
			fileDiv.innerHTML = reader.result;

			let sections = fileDiv.querySelectorAll(':scope > div, header, section');
			if(sections.length) {
				if(this.overwriteExistingContent) {
					this.props.sections.clearSections();
				}

				let lastSection = null;
				for(let s of sections) {
					let {title, type, text} = Section.fromHTML(s);
					if(!title && lastSection) {
						lastSection.text += text;
					}
					else {
						lastSection = this.props.sections.addSection(type, title, text);
					}
				}
			}
			else {
				alert('No section elements or div\'s with class "section" found');
			}
		};

		reader.readAsText(files[0]);
	};

	@action onDropBibFile = (files) => {
		if(files.length != 1) {
			this.props.appState.snackBarMessage = 'Please choose (only) one bib file';
		}
		else {
			this.props.appState.snackBarMessage = 'Please wait until bib file is loaded';
			var reader = new FileReader();
			reader.onloadend = () => {
				let text = this.props.bibliographyStore.toJSON(reader.result);
				this.text = this.props.bibliographyStore.toHTML(text);
				this.props.appState.snackBarMessage = 'Bib file is loaded. Please proceed';
			};
			reader.readAsText(files[0]);
		}
	};

	downloadContent = () => {
		downloadFile('content.html', this.props.sections.getSectionsAsHTML);
	};

	deleteContent = () => {
		downloadFile('backup.html', this.props.sections.getSectionsAsHTML);
		this.props.sections.clearSections();
	};

	@action onCheck = (event) => {
		this.overwriteExistingContent = event.target.checked;
	};

	public render(): JSX.Element {
		const dropDown = (
			<DropDownMenu value={SectionTypes.CHAPTER} autoWidth={false} onChange={this.openAddSectionDialog}
						  style={{minWidth: '180px', float: 'none'}}
						  underlineStyle={{display: 'none'}}>
				{SectionTypeMap.map((name, index) => {
					return <MenuItem key={name} value={index} primaryText={name} />
				})}
			</DropDownMenu>
		);

		const iconButtonElement = (
			<IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
				<MoreVertIcon color={'#999'} />
			</IconButton>
		);

		const rightIconMenu = (
			<IconMenu iconButtonElement={iconButtonElement}>
				<MenuItem onTouchTap={this.openImportSectionDialog}>Import Sections</MenuItem>
				<MenuItem onTouchTap={this.downloadContent}>Export Sections</MenuItem>
				<MenuItem onTouchTap={this.deleteContent}>Delete Sections</MenuItem>
			</IconMenu>
		);

		const addSectionDialogActions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.closeAddSectionDialog}
			/>,
			<FlatButton
				label="Add"
				disabled={this.title.length == 0 || (this.sectionType == SectionTypes.BIBLIOGRAPHY && this.text.length == 0)}
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.addSection}
			/>,
		];

		return (
			<div>
				<MenuItem secondaryText={dropDown} rightIcon={rightIconMenu}>Add: </MenuItem>
				<Dialog
					title={"Import sections from file"}
					actions={[<FlatButton
						label="Cancel"
						primary={true}
						onTouchTap={this.closeImportSectionDialog}
					/>]}
					autoScrollBodyContent={true}
					modal={false}
					open={this.importSectionDialogOpen}
					onRequestClose={this.closeImportSectionDialog}>
						<Checkbox checked={this.overwriteExistingContent} onCheck={this.onCheck} label="Overwrite existing content?!!!" />
						<Dropzone onDrop={this.onDropFile} className="content__newSectionDropzone">
							Click or Drag&amp;Drop a HTML file into this box.
						</Dropzone>
				</Dialog>
				<Dialog
					title={"Add new "+SectionTypeMap[this.sectionType]}
					actions={addSectionDialogActions}
					autoScrollBodyContent={true}
					modal={false}
					open={this.addSectionDialogOpen}
					onRequestClose={this.closeAddSectionDialog}>
					<form onSubmit={this.submitAddSectionDialog}>
						<DropDownMenu value={this.insertionType} onChange={this.updateInsertionType}>
							{InsertionTypeMap.map((name, index) => {
								return <MenuItem key={name} value={index} primaryText={name} />
							})}
						</DropDownMenu>
						<DropDownMenu value={this.sectionType} onChange={this.updateSectionType}>
							{SectionTypeMap.map((name, index) => {
								return <MenuItem key={name} value={index} primaryText={name} />
							})}
						</DropDownMenu>
						<TextField
							ref={ (c) => { this.textField = c } }
							errorText="This field is required"
							floatingLabelText={SectionTypeMap[this.sectionType]+" title"}
							onChange={this.updateTitle}
						/>
						{this.sectionType == SectionTypes.BIBLIOGRAPHY ?
							<Dropzone onDrop={this.onDropBibFile} className="content__newSectionDropzone">
								{this.files.length ? this.files[0].file.name : "Click or Drag&Drop a Bib file into this box."}
							</Dropzone> : undefined}
					</form>
				</Dialog>
			</div>
		)
	}
}
