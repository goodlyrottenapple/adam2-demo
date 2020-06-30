import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';

const resourceDataLevelEnum = ["UNKNOWN", "DATABASE", "METADATA", "SUMMARISED", "DATASET", "RECORDSET", "RECORD", "RECORDFIELD"]

export default class PRofileProperties extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			profileName:'',
			profileVersion:'',
			profileCreateDate:'',
		},
	}


  componentDidMount() {
    this.props.setData(this.state.data);
  }

	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};
		newData[prop_name] = e.target.value;
		this.setState({data: newData});
		this.props.setData(newData);
	}

	render() {
		return (
		  <div>
			  <Grid>
			  	<GridColumn medium={12}>
						<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Profile Name:</h5>
						<Textfield
							name="profileName"
							defaultValue={this.state.data.profileName}
							onChange={this.handleChange('profileName')}
						/>
			  	</GridColumn>

					<GridColumn >
						<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Profile Version:</h5>
						<Textfield
							name="profileVersion"
							defaultValue={this.state.data.profileVersion}
							onChange={this.handleChange('profileVersion')}
						/>
			  	</GridColumn>

					<GridColumn>
						<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Profile Create Date:</h5>
						<Textfield
							name="profileCreateDate"
							defaultValue={this.state.data.profileCreateDate}
							onChange={this.handleChange('profileCreateDate')}
						/>
			  	</GridColumn>

				</Grid>
		  </div>
		);
	}
}
