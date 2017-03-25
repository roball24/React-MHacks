import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
	backgroundColor: ${props => props.background};
`

const Theme1 = {
	primary: '#A4FFA5',
	secondary: '#5391FB',
	background: '#E6E6E6'
};

const Theme2 = {
	primary: '#F5EFFB',
	secondary: '#F94963',
	background: '#212222'
}

class ThemeWrapper extends React.Component {

	constructor(){
		super();

		this.state = {
			currentTheme: Theme1,
			usingAlternate: false
		};
		this.changeTheme = this.changeTheme.bind(this);
	}

	changeTheme(){

		if (this.state.usingAlternate){
			this.setState({
				currentTheme: Theme1,
				usingAlternate: false
			})

		} else {
			this.setState({
				currentTheme: Theme2,
				usingAlternate: true
			})

		}
	}

	render(){
		return (
			<Box background={this.state.currentTheme.background}>Theme {this.props.theme}
				<button onClick={this.changeTheme}>Change Theme</button>
			</Box>
		)
	}
}

export default ThemeWrapper;