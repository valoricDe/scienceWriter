import {observable, computed, autorunAsync, action, autorun, asMap, map} from "mobx";
import {SectionTypes, default as Section, StoragePrefix} from "../models/section";
import ISection = Models.ISection;

export const enum InsertionType {
	PREPEND, APPEND
}

let InsertionTypeMapTemp: Array<string> = [];
InsertionTypeMapTemp[InsertionType.PREPEND] = 'Prepend';
InsertionTypeMapTemp[InsertionType.APPEND] = 'Append';

export const InsertionTypeMap = InsertionTypeMapTemp;

export class Sections implements Stores.ISections {
	@observable sections:Array<Models.ISection> = [];

	@computed get contentSections() {
		return this.sections.filter((section: Models.ISection) => {
			return section.type == SectionTypes.CHAPTER || section.type == SectionTypes.FIGURETOC || section.type == SectionTypes.BIBLIOGRAPHY
		});
	}

	@computed get ids() {
		return this.sections.map(s => s.id);
	}

	@computed get lastID() {
		return this.sections.length ? Math.max(...this.ids) : -1;
	}

	@computed get getSectionsAsHTML() {
		return this.sections.map((s: Section) => s.toHTML).join('\n');
	}

	/** @return string */
	@computed get getSectionsAsText() {
		return this.sections.map((s: Section) => s.toText).join('\n');
	}

	@action addSection(type: number, title: string, text: string = '', insertionMode = InsertionType.APPEND, files = []) {
		let section = new Section(this, this.lastID+1, this.sections.length, title, type, text, files);
		let result = insertionMode == InsertionType.APPEND ? this.sections.push(section) : this.sections.unshift(section);
		if(insertionMode == InsertionType.PREPEND) {
			this.sections = this.sections.map((s, i) => {s.index = i; return s;});
		}
		return section;
	}

	@action moveSection(oldIndex, newIndex) {
		if (newIndex >= this.sections.length) {
			newIndex = this.sections.length;
		}
		this.sections.splice(newIndex, 0, this.sections.splice(oldIndex, 1)[0]);
		this.sections = this.sections.map((s, i) => {s.index = i; return s;});
	}

	@action removeSection(section: Models.ISection, triggeredFromModel = false) {
		if(!triggeredFromModel) {
			section.remove(true);
		}

		let index = this.sections.indexOf(section);
		if (index > -1) {
			delete this.sections[index];
			this.sections.splice(index, 1);
		}
		return index;
	}

	@action clearSections() {
		this.sections.map(s => s.remove(true));
		this.sections.clear();
	}

	@action removeSectionByID(id: number, triggeredFromModel = false) {
		let section = this.sections.find(s => s.id == id);
		return section !== undefined ? this.removeSection(section) : -1;
	}

	@action	loadSections() {
		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (StoragePrefix && key.indexOf(StoragePrefix) === 0) {
				const json = JSON.parse(window.localStorage.getItem(key));
				const section = new Section(this, json.id, json.index, json.title, json.type, json.text, json.files);
				this.sections.push(section);
			}
		}
		this.sections = this.sections.sort((s1, s2) => s1.index - s2.index);
	}

	findSectionByID(id) {
		return this.sections.find(s => s.id == id);
	}
}

/*export function isSection(object) {
	return object instanceof ISection;
}*/