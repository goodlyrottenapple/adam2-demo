import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';


export default class ResourceReferences extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			resourceReferences:['']
		},
	}

  componentDidMount() {
    this.props.setData(this.state.data);
  }

	handleChange = prop_name => e =>  {
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
		  		<GridColumn medium={8}>
						<h5 style={{paddingBottom: '0.5em'}}>Resource Reference (Citation, URL, DOI, etc.):</h5>
						<Textfield
							name="reference"
							defaultValue={this.state.data.resourceReferences[0]}
							onChange={this.handleChange('reference')}
						/>
		  		</GridColumn>
				</Grid>
		  </div>
		);
	}
}