import React, { Component } from 'react';
import DevTools from 'mobx-react-devtools';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {MuiThemeProvider, lightBaseTheme} from "material-ui/styles";
import injectTapEventPlugin from 'react-tap-event-plugin';
import {AppBar} from "material-ui";
import {Snackbar} from "material-ui";
import {Drawer} from "material-ui";

import Content from './content';
import Sidebar from "./sidebar";
import {observer} from "mobx-react";
import {observable} from "mobx";

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const lightMuiTheme = getMuiTheme(lightBaseTheme);

@observer
export default class App extends Component<Props.IApp, void> {
	@observable sidebarOpen = true;

	constructor(props) {
		super(props);
		this.props.sections.loadSections();
		this.props.bibliographyStore.loadItems();
	}

	private renderDevTools(): JSX.Element | null {
		if (process.env.NODE_ENV !== 'production') {
			return <DevTools />;
		}

		return null;
	};

	public render(): JSX.Element {
		return (
			<MuiThemeProvider muiTheme={lightMuiTheme}>
				<div className='wrapper'>
					<Snackbar
						open={this.props.appState.snackBarOpen}
						message={this.props.appState.snackBarMessage}
						autoHideDuration={4000}
						onRequestClose={this.props.appState.closeSnackBar}
					/>
					<Drawer open={this.sidebarOpen} className="drawer">
						<AppBar title="ScienceWriter" style={{marginBottom: '10px', backgroundColor: '#2d8ac7'}}
								onLeftIconButtonTouchTap={() => {this.sidebarOpen = !this.sidebarOpen} }
								onTitleTouchTap={() => {this.sidebarOpen = !this.sidebarOpen} }
						/>
						<Sidebar {...this.props}/>
					</Drawer>
					<div className="content__wrapper" style={this.sidebarOpen ? {marginLeft: "256px"} : {marginLeft: "0"}}>
						<AppBar title="" showMenuIconButton={false} style={{backgroundColor: '#2d8ac7'}}
								onTitleTouchTap={() => {this.sidebarOpen = !this.sidebarOpen}}
								className="mainAppBar"
						/>
						{this.sidebarOpen ? this.renderDevTools() : null}
						<Content {...this.props} />
					</div>
				</div>
			</MuiThemeProvider>
		);
	};
};
