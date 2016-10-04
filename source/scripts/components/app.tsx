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

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const lightMuiTheme = getMuiTheme(lightBaseTheme);

export default class App extends Component<Props.IApp, void> {
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
					<Drawer open={true}>
						<AppBar title="ScienceWriter" style={{marginBottom: '10px', backgroundColor: '#2d8ac7'}} />
						<Sidebar {...this.props}/>
					</Drawer>
					<div style={{marginLeft: '256px'}}>
						<AppBar title="" showMenuIconButton={false} style={{backgroundColor: '#2d8ac7'}}/>
						{this.renderDevTools()}
						<Content {...this.props} />
					</div>
				</div>
			</MuiThemeProvider>
		);
	};
};
