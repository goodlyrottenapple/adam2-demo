import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import Header from '../Header';


export default class ResourceOrganisations extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			resourceOrganisations:[]
		},
	}

  componentDidMount() {
    this.props.setData(this.state.data);
  }

	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};

		// Update the contacts array
		newData.resourceOrganisations[0] = e.target.value;

		this.setState({data: newData});
		this.props.setData(newData);
	}

	render() {
		return (
			<Grid>
				<GridColumn medium={14}>
					<Header style={{paddingBottom: '0.5em'}} name="resource_organisations" advancedMode={this.props.advancedMode}/>
					<Textfield
						name="organisation"
						defaultValue={this.state.data.resourceOrganisations[0]}
						onChange={this.handleChange('organisations')}
					/>
				</GridColumn>
			</Grid>
		);
	}
}
