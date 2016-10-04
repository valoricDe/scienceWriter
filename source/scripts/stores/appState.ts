import {observable, computed, action} from "mobx";

export class AppState implements Stores.IAppState {
	@observable activeMenuItem = null;
	@observable snackBarMessage = '';

	@computed get snackBarOpen() {
		return this.snackBarMessage != "";
	}

	@action closeSnackBar = () => {
		this.snackBarMessage = "";
	}
}