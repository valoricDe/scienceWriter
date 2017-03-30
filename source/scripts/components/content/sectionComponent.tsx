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
			<Paper className={"content__sectionWrapper "+SectionTypeMap[this.props.section.type]}>
				<div className="content__customToolbar">
					<p className="content__customToolbarTitleRight" style={{float: 'right'}}>{this.props.section.type == SectionTypes.CHAPTER ? <ToolbarTitle text={SectionTypeMap[this.props.section.type]+' '+(this.props.section.index-1)} className="content__customToolbarTitleRight"/> :  null }</p>
					<h1 style={{float: 'left'}} id={"section-"+this.props.section.id} className="content__customToolbarTitle">
						{this.props.section.title || ''}
					</h1>
					<div style={{clear: 'both', height:'0'}}></div>
				</div>
				<section name={"section-"+this.props.section.id}>
					{(() => {
						switch (this.props.section.type) {
							case SectionTypes.TOC:
								return <List>
									{
										this.props.sections.contentSections.map((s:ISection, i:number) => {
											let chapters = [<ListItem className={'content__toc_sec'} key={s.id} primaryText={(i+1)+'. '+s.title} href={"#section-"+ s.id} onTouchTap={() => location.href= "#section-"+ s.id}/>];
											for (let j = 0; j < s.subsections.length; j++) {
												let subs = s.subsections[j];
												chapters.push(<ListItem className={'content__toc_sub'+String((subs.num.length+1)/2)} key={subs.id} primaryText={(i+1)+'.'+subs.num+'. '+subs.title} href={"#"+ subs.id} onTouchTap={() => location.href= "#"+ subs.id}/>);
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
