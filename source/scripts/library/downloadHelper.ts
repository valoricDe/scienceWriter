
export function downloadFile(filename, data) {
	let blob = new Blob([data], {type: 'text/html'});
	if(window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveBlob(blob, filename);
	}
	else {
		var elem = window.document.createElement('a');
		elem.href = window.URL.createObjectURL(blob);
		elem.download = filename;
		document.body.appendChild(elem);
		elem.click();
		window.URL.revokeObjectURL(elem.href);
		document.body.removeChild(elem);
	}
};