/**
 * Created by velten on 05.08.16.
 */
import {observable, computed, autorunAsync, action, autorun} from "mobx";

export const enum SectionTypes {
	COVER, TITLEPAGE, ABSTRACT, TOC, CHAPTER, FIGURETOC, APPENDIX, BIBLIOGRAPHY
}

export const SectionTypeMap: Array<string> = [];
SectionTypeMap[SectionTypes.COVER] = 'Cover';
SectionTypeMap[SectionTypes.TITLEPAGE] = 'Title page';
SectionTypeMap[SectionTypes.ABSTRACT] = 'Abstract';
SectionTypeMap[SectionTypes.TOC] = 'Table of contents';
SectionTypeMap[SectionTypes.CHAPTER] = 'Chapter';
SectionTypeMap[SectionTypes.FIGURETOC] = 'Table of figures';
SectionTypeMap[SectionTypes.APPENDIX] = 'Appendix';
SectionTypeMap[SectionTypes.BIBLIOGRAPHY] = 'Bibliography';

export const enum FileTypes {
	IMAGE, BIBLIOGRAPHY
}

export const FileTypeMap: Array<string> = [];
FileTypeMap[FileTypes.IMAGE] = 'Image';
FileTypeMap[FileTypes.BIBLIOGRAPHY] = 'Bibliography';

export const StoragePrefix = "sections.";

export const headlineTagNames = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
export const headlineRegexp = new RegExp('<'+'h(\\d)[^>]*(id="([^"]*)")?[^>]*>([^<]*)', 'img');
const parser = new DOMParser();

export default class Section implements Models.ISection {
	store;
	id;
	@observable index;
	@observable title;
	@observable type: SectionTypes;
	@observable text;
	@observable files;

	_saveHandle;

	constructor(store, id, index, title, type, text = '', files = []) {
		this.store = store;
		this.id = id;
		this.index = index;
		this.title = title;
		this.type = type;
		this.text = text;
		this.files = files;

		const saveSectionsMostlyASecond = () => {
			window.localStorage.setItem(StoragePrefix + this.id, JSON.stringify(this.toJSON));
		};
		this._saveHandle = autorunAsync(saveSectionsMostlyASecond, 1000);
	}

	@computed get subsections() {
		if(this.type != SectionTypes.CHAPTER) return [];
		let doc = parser.parseFromString(this.text, "text/html");
		let headlines = doc.querySelectorAll(headlineTagNames.join(', '));

		let hd, a, r = [], numberings = [0, 0, 0, 0, 0, 0];

		for(let h of headlines) {
			if(Number(h.tagName[1]) > 3) continue;
			hd = Math.max(parseInt(h.tagName[1])-2, 0);
			numberings[hd]++;
			numberings.splice(hd+1, 6-hd-1, ...Array(6-hd-1).fill(0));
			a = h.querySelector('a[id]');
			r.push({id: a ? a.id : h.id, title: h.textContent, num: numberings.slice(0, hd+1).join('.')});
		}
		return r;
	}

	@computed get figures() {
		let doc = parser.parseFromString(this.text, "text/html");
		let figures = doc.querySelectorAll('figure');

		let a, id, caption, r = [];

		for(let f of figures) {
			a = f.querySelector('a[id]');
			id = a ? a.id : f.id;
			caption = f.querySelector('caption');
			r.push({id: a ? a.id : f.id, title: caption ? caption.textContent : id});
		}
		return r;
	}

	@computed get tables() {
		let doc = parser.parseFromString(this.text, "text/html");
		let tables = doc.querySelectorAll('table');

		let a, id, caption, r = [];

		for(let f of tables) {
			a = f.querySelector('a[id]');
			id = a ? a.id : f.id;
			caption = f.querySelector('caption');
			r.push({id: a ? a.id : f.id, title: caption ? caption.textContent : id});
		}
		return r;
	}

	@computed get toText() {
		let doc = parser.parseFromString(this.text, "text/html");
		return "###" + this.title + "###\n" + doc.body.textContent;
	}

	static fromHTML(s: Element) {
		let headline = s.querySelector('h1') || s.querySelector('h2') || s.querySelector('h3');
		let title;
		if(headline) {
			title = headline.textContent;
			headline.remove();
		}
		else {
			title = '';
		}

		let type = parseInt(s.getAttribute('data-type'));
		if(!type) {
			type = (/header/i).test(s.tagName) ? SectionTypes.COVER : SectionTypes.CHAPTER;
		}

		return {type: type, title: title, text: s.innerHTML};
	}

	@computed get toJSON() {
		return {
			id: this.id,
			index: this.index,
			type: this.type,
			title: this.title,
			text: this.text,
			files: this.files,
		}
	}

	@computed get toHTML() {
		let sectionElement = this.type == SectionTypes.CHAPTER ? 'section' : (
			this.type == SectionTypes.COVER ? 'header' : 'div'
		);
		return '<'+sectionElement+' id="'+this.id+'" data-type="'+this.type+'"><h1>'+this.title+'</h1>'+this.text+'</'+sectionElement+'>';
	}

	@action	setText(text) {
		this.text = text;
	}

	@action	remove(triggeredFromStore = false) {
		this._saveHandle(); // stop saving future changes
		window.localStorage.removeItem(StoragePrefix + this.id);
		if(!triggeredFromStore)
			this.store.removeSection(this, true);
	}
}