import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ListItem} from "material-ui";
import {List} from "material-ui";
import Paper from "material-ui/Paper";
import Toolbar from "material-ui/Toolbar/Toolbar";
import ToolbarGroup from "material-ui/Toolbar/ToolbarGroup";
import ToolbarTitle from "material-ui/Toolbar/ToolbarTitle";
import {SectionTypeMap, SectionTypes} from "../../models/section";
import {observer, inject} from "mobx-react";
import {autorun, action} from "mobx/lib/mobx";
import ISectionComponent = Props.Content.ISectionComponent;
import ISection = Models.ISection;
import SectionTinymce from "./SectionTinymce";

@observer
export default class SectionComponent extends React.Component<ISectionComponent, {}> {

	constructor(props) {
		super(props);
		let activeMenuItem = () => {
			if (this.props.appState.activeMenuItem == props.section.id) {
				ReactDOM.findDOMNode<HTMLElement>(this).scrollIntoView();
			}
		}
		autorun(activeMenuItem);
	}

	@action sectionTextChanged = (content) => {
		this.props.section.text = content;
	};

	public render():JSX.Element {
		return (
			<Paper className="content__sectionWrapper">
				<Toolbar className="content__customToolbar">
					<ToolbarGroup>
						<ToolbarTitle text={this.props.section.title || ''} className="content__customToolbarTitle"/>
					</ToolbarGroup>
					<ToolbarGroup>
						<ToolbarTitle text={SectionTypeMap[this.props.section.type]+' '+(this.props.section.index+1)} className="content__customToolbarTitleRight"/>
					</ToolbarGroup>
				</Toolbar>
				<section name={"section-"+this.props.section.id}>
					{(() => {
						switch (this.props.section.type) {
							case SectionTypes.TOC:
								return <List>
									{
										this.props.sections.contentSections.map((s:ISection, i:number) => {
											let chapters = [<ListItem key={s.id} primaryText={(i+1)+'. '+s.title} onTouchTap={() => location.href= "#section-"+ s.id}/>];
											for (let j = 0; j < s.subsections.length; j++) {
												let subs = s.subsections[j];
												chapters.push(<ListItem key={subs.id} primaryText={(i+1)+'.'+subs.num+'. '+subs.title} onTouchTap={() => location.href= "#subsection-"+ subs.id}/>);
											}
											return chapters;
										})
									}
								</List>;
							case SectionTypes.BIBLIOGRAPHY:
								return <div dangerouslySetInnerHTML={{__html: this.props.section.text}}></div>;
							default:
								return <SectionTinymce index={this.props.index} onChange={this.sectionTextChanged} section={this.props.section} {...this.props} />;
						}
					})()}
				</section>
			</Paper>
		)
	}
}
