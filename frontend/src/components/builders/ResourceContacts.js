import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';


export default class Contact extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			resourceContacts:[{name:'', email:''}]
		},
	}

  componentDidMount() {
    this.props.setData(this.state.data);
  }

	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};

		// Update the contacts array
		newData.resourceContacts[0][prop_name] = e.target.value;

		this.setState({data: newData});
		this.props.setData(newData);
	}

	render() {
		return (
		  <div>
		  <Grid>
		  	<GridColumn>
					<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Contact Name:</h5>
					<Textfield
						name="name"
						defaultValue={this.state.data.resourceContacts[0].name}
						onChange={this.handleChange('name')}
					/>
		  	</GridColumn>
				<GridColumn>
		  		<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Contact Email:</h5>
          <Textfield
		      name="email"
		      defaultValue={this.state.data.resourceContacts[0].email}
		      onChange={this.handleChange('email')}
		    />
		    </GridColumn>

				</Grid>

		  </div>
		);
	}
}
