import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import Header from '../Header';


export default class ResourceReferences extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			resourceReferences:[]
		},
	}

  componentDidMount() {
    this.props.setData(this.state.data);
  }

	handleChange = e =>  {
		const newData = {...this.state.data};

		// Update the contacts array
		newData.resourceReferences[0] = e.target.value;

		this.setState({data: newData});
		this.props.setData(newData);
	}

	render() {
		return (
		  <div>
		  	<Grid>
		  		<GridColumn>
						<Header style={{paddingBottom: '0.5em'}} name="resource_references" advancedMode={this.props.advancedMode}/>	
						<Textfield
							name="reference"
							defaultValue={this.state.data.resourceReferences[0]}
							onChange={this.handleChange}
						/>
		  		</GridColumn>
				</Grid>
		  </div>
		);
	}
}
