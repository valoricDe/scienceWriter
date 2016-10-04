import {observable, action, autorunAsync} from "mobx/lib/mobx";
const bibtexParse = require('bibtex-parser-js');

export const StoragePrefix = "bib.";

export class BibliographyStore implements Stores.IBibliographyStore {
	@observable bibItems = [];
	_saveHandle = null;

	constructor() {

		let saveBibMostlyASecond = () => {
			window.localStorage.setItem(StoragePrefix, JSON.stringify(this.bibItems));
		};
		this._saveHandle = autorunAsync(saveBibMostlyASecond, 1000);
	}

	@action	loadItems() {
		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (key.indexOf(StoragePrefix) === 0) {
				const json = JSON.parse(window.localStorage.getItem(key));
				this.bibItems = this.bibItems.concat(json);
			}
		}
		var seen = {};
		this.bibItems = this.bibItems.filter(function(item) {
			return seen.hasOwnProperty(item.citationKey) ? false : (seen[item.citationKey] = true);
		});
	}

	@action toJSON(text) {
		let items = bibtexParse.toJSON(text);
		this.bibItems = items;
		return items;
	}

	toHTML(json) {
		let items = json.map((item) => {
			let result = [];

			if (item.entryTags.AUTHOR) {
				result.push(this.formatAuthors(item.entryTags.AUTHOR));
			}

			if (item.entryTags.TITLE) {
				result.push(item.entryTags.TITLE);
			}
			if (item.entryTags.BOOKTITLE) {
				result.push('<i>' + item.entryTags.BOOKTITLE + '</i>');
			}
			if (item.entryTags.PUBLISHER) {
				result.push('<i>' + item.entryTags.PUBLISHER + '</i>');
			}
			if (item.entryTags.YEAR) {
				result.push(item.entryTags.YEAR);
			}

			if (item.entryTags.URL) {
				result.push('<a href="'+item.entryTags.URL+'">' + item.entryTags.URL + '</a>');
			}

			if (item.entryTags.NOTE) {
				result.push('<i>' + item.entryTags.NOTE + '</i>');
			}

			return '<tr><td name="bibliography-' + item.citationKey + '">[' + item.citationKey + ']</td><td>'+result.join(', ')+'.</td></tr>';
		});

		return '<table>'+items.join('')+'</table>';
	}

	short(item) {
		let short = item.entryTags.TITLE ? item.entryTags.TITLE : this.formatAuthors(item.entryTags.AUTHOR);
		return '[' + item.citationKey + ']' + (short ? ': '+ short :'');
	}

	formatAuthors = (authorsString) => {
		var authors = authorsString.split('and');

		if (authors.length > 3) {
			return authors[0] + ' <i>et al.</i>';
		} else {
			return authorsString;
		}
	}
}