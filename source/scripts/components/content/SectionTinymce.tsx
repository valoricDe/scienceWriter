import * as React from 'react';
import {observer, inject} from "mobx-react";
import ISectionTinymce = Props.Content.ISectionTinymce;
import {SectionTypes, headlineTagNames, headlineRegexp} from "../../models/section";
import {camelize} from "../../library/stringHelper"
require("tinymce/tinymce");
const TinyMCE = require("react-tinymce");

@observer
export default class SectionTinymce extends React.Component<ISectionTinymce, {}> {
	tinymce = null;

	// If the page index changes, we need to kill TinyMCE...
	componentWillReceiveProps(props) {
		if (this.tinymce && props.index !== this.props.index) {
			this.tinymce._remove();
		}
	}

	//...and then bring it back.
	componentDidUpdate (props) {
		if (this.tinymce && props.index !== this.props.index) {
			this.tinymce._init(this.tinymce.props.config, this.tinymce.props.content);
		}
	}

	public render(): JSX.Element {
		const {sections, bibliographyStore, onChange, section} = this.props;

		return (
			<TinyMCE
				ref={(editor) => {this.tinymce = editor}}
				content={section.text}
				config={{
					//index: this.props.index,
						//selector:'#content',
						inline: true,
            plugins: [
							// all: advlist,autolink,colorpicker,contextmenu,image,imagetools,layer,tabfocus,textpattern,wordcount,codesample,save,textcolor,anchor,charmap,code,fullpage,fullscreen,hr,insertdatetime,link,media,nonbreaking,pagebreak,paste,preview,print,searchreplace,table,template,visualblocks,visualchars

							// importcss could be usefull
							'advlist autolink colorpicker contextmenu image imagetools layer tabfocus textpattern wordcount', // autoresize without menu and toolbar entry
							'textcolor', // codesample save with toolbar button
							'anchor charmap code fullpage fullscreen hr insertdatetime link media nonbreaking pagebreak paste preview print searchreplace table template visualblocks visualchars', // with menu and toolbar entry
							'mention', // external plugins asciimath4 localautosave
            ],
						external_plugins: {
							//'asciimath4': '/vendor/asciimath-tinymce4/plugin.js',
							'mention': 'vendor/tinyMCE-mention/mention/plugin.js',
							//'localautosave' : '/vendor/TinyMCE-LocalAutoSave/localautosave/plugin.min.js'
						},
						toolbar: ' styleselect formatselect | bold italic underline | alignleft aligncenter alignjustify | bullist numlist | outdent indent | blockquote | removeformat | table hr link unlink pagebreak codesample asciimath4 | code visualblocks visualchars | undo redo fullscreen localautosave | save',

						// tinymce settings
						//entity_encoding : "raw",
						//content_css : 'css/custom.css',
						browser_spellcheck : true,
						/* specify events for editor */
						setup : function setup(editor) {
							/*const siblingToggle = function(selector, show) {
								let p = editor.contentAreaContainer.parentNode;
								p.querySelector(selector).style.display = show ? 'block': 'none';
							};

							editor.addButton('showMenu', {
								text: "Menu",
								icon: 'options',
								onclick: function () {
									editor.menubar = !editor.menubar;
									let p = editor.contentAreaContainer.parentNode;
									p.querySelector(".mce-menubar").style.display = editor.menubar ? 'block': 'none';
								}
							});

							editor.on('focus', function () {
								siblingToggle(".mce-toolbar-grp", true);
							});
							editor.on('blur', function () {
								siblingToggle(".mce-toolbar-grp", false);
							});
							editor.on("init", function () {
								siblingToggle(".mce-toolbar-grp", false);
							});*/

							let on = window.attachEvent || window.addEventListener;
							let unload = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compitable

							on(unload, function(e) { // For >=IE7, Chrome, Firefox
								onChange(editor.getContent());
							});

							/*editor.on('change', function() {
							 jQuery(editor.contentDocument.body).find('p').hyphenate(lang);
							 });*/
							/*editor.on('NodeChange', function(e) {
							 ajaxSave(editor);
							 });*/

							/*jQuery( window ).unload(function() {
								ajaxSave(editor);
							});*/
						},
						/* change dom and elements of editor */
						init_instance_callback: (editor) => {
							//updateInfo(editor);

							/*const siblingToggle = function(selector, show) {
								let p = editor.contentAreaContainer.parentNode;
								p.querySelector(selector).style.display = show ? 'block': 'none';
							};
							editor.menubar = false;
							siblingToggle(".mce-menubar", false);*/

							/*jQuery(editor.getBody()).attr('lang', lang).css({
								'-webkit-hyphens': 'auto',
								'-moz-hyphens': 'auto',
								'-ms-hyphens': 'auto',
								'hyphens': 'auto',
								'hyphenate-limit-chars': 'auto 5',
								'hyphenate-limit-lines': '2',
							});*/

							//jQuery('#tblspecializations tr > td:contains(Some Value) + td:contains(2)').length
							//var bibs = editor.dom.select('td:contains("bibtexify:")');
							/*tinymce.each(bibs, function(node) {
								var table = jQuery(node).closest('table');
								var path = node.textContent.replace('bibtexify:', '').trim();

								var wrapper = jQuery('<div style="display:none">');
								var placeHolderTable = jQuery('<table data-bibtex="'+path+'">');

								wrapper.append(placeHolderTable);
								jQuery('body').append(wrapper);
								//table.attr('id', id);

								bibtexify(path, placeHolderTable, {'visualization': false});

								var i = setInterval(function () {
									if(placeHolderTable[0].innerHTML.length > 0) {
										table[0].outerHTML = placeHolderTable[0].outerHTML;
										wrapper.remove();
										clearInterval(i);
									}
								}, 0);
							});*/

							//initEditorOutline(editor, editor.getDoc());
						},
						style_formats: [
							{ title: 'Headers', items: [
								{ title: 'h1', block: 'h1' },
								{ title: 'h2', block: 'h2' },
								{ title: 'h3', block: 'h3' },
								{ title: 'h4', block: 'h4' },
								{ title: 'h5', block: 'h5' },
								{ title: 'h6', block: 'h6' }
							] },
							{ title: 'Blocks', items: [
								{ title: 'p', block: 'p' },
								{ title: 'div', block: 'div' },
								{ title: 'pre', block: 'pre' }
							] },
							{ title: 'Containers', items: [
								{ title: 'section', block: 'section', wrapper: true, merge_siblings: false },
								{ title: 'article', block: 'article', wrapper: true, merge_siblings: false },
								{ title: 'blockquote', block: 'blockquote', wrapper: true },
								{ title: 'hgroup', block: 'hgroup', wrapper: true },
								{ title: 'aside', block: 'aside', wrapper: true },
								{ title: 'figure', block: 'figure', wrapper: true },
								{ title: 'toc', block: 'div', wrapper: false, attributes: {id: 'toc'} },
								{ title: 'remark', block: 'div', classes: 'remark', attributes: {style: 'float: right; width: 300px;'}},
							] },
							{ title: 'Markers', items: [
								{ title: 'reference', inline: 'sup', classes: 'reference'},
								{ title: 'footnote', inline: 'sub', classes: 'footnote'},
								{ title: 'question', block: 'p', classes: 'alert question', wrapper: true  },
							] }
						],
						valid_elements : '+*[*]',
						end_container_on_empty_block: true,

						// plugin settings
						image_caption: true,
						las_seconds: 60,
						las_nVersions: 50,
						image_advtab: true,
						save_enablewhendirty: true,
						//save_onsavecallback: function (editor) { ajaxSave(editor, true); return false },
						visualblocks_default_state: true,
						mentions: {
							delay: 100,
							delimiter: ['@'],
							items: 100,
							closeOnScroll: false,
							source: function (query, process, delimiter) {
								if (delimiter === '@') {
									let chapters = [];
									for (let i = 0; i < sections.sections.length; i++) {
										let s = sections.sections[i];
										chapters.push({id: 'section-'+s.id, type: SectionTypes.CHAPTER, short: 'Chapter '+(i+1)+' ('+s.title+')', name: 'Chapter '+(i+1)+': '+s.title});
										for (let j = 0; j < s.subsections.length; j++) {
											let subs = s.subsections[j];
											chapters.push({id: 'subsection-'+subs.id, type: SectionTypes.CHAPTER, short: 'Chapter '+(i+1)+'.'+subs.num+' ('+subs.title+')', name: 'Chapter '+(i+1)+'.'+subs.num+': '+subs.title});
										}
									}

									let bibItems = bibliographyStore.bibItems.map(function(item) {
										return {id: 'bibliography-'+item.citationKey, type: SectionTypes.BIBLIOGRAPHY, short: '['+item.citationKey+']', name: bibliographyStore.short(item)};
									});

									let data = chapters.concat(bibItems);

									process(data);
								}
							},
							insert: (item) => {
								return '<a href="#'+item.id +'" onclick="console.log(this.href.replace(/.*#/, \'\')); var e = document.getElementsByName(this.href.replace(/.*#/, \'\')); console.log(e); if(e.length) e[0].scrollIntoView(true); window.tinymce.activeEditor.trigger(\'blur\')">' + item.short + '</a>';
							}
						},
          }}
				onChange={(e) => {
					let editor = e.target;
					if(headlineTagNames.indexOf(editor.selection.getNode().tagName) >= 0 && !editor.selection.getNode().querySelector('a')) {
						let a = document.createElement("a");
						a.title = a.id = 'subsection-'+camelize(editor.selection.getNode().textContent);
						a.className = 'mce-item-anchor';
						editor.selection.getNode().appendChild(a);
					}
					let content = editor.getContent({format : editor.settings.entity_encoding ? editor.settings.entity_encoding : 'named'});
					onChange(content);
				}}
			/>
		);
	}
}
