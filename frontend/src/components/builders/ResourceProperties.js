import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';

const resourceDataLevelEnum = ["UNKNOWN", "DATABASE", "METADATA", "SUMMARISED", "DATASET", "RECORDSET", "RECORD", "RECORDFIELD"]

export default class ResourceProperties extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			resourceName:'',
			resourceDataLevel:resourceDataLevelEnum[0],
			resourceDescription: '',
		},
	}


  componentDidMount() {
    this.props.setData(this.state.data);
  }

	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};

		// Data Level
		if (prop_name === 'resourceDataLevel'){
			newData[prop_name] = e.value;
		}
		else {
			newData[prop_name] = e.target.value;
		}

		this.setState({data: newData});
		this.props.setData(newData);
	}

	render() {
		return (
		  <div>
			  <Grid>
			  	<GridColumn>
						<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Resource Name:</h5>
						<Textfield
							name="resourceName"
							defaultValue={this.state.data.resourceName}
							onChange={this.handleChange('resourceName')}
						/>
			  	</GridColumn>

					<GridColumn>
			  		<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Data Level:</h5>
	          <Select
	            className="single-select"
	          	classNamePrefix="react-select"
	          	menuPortalTarget={document.body}
	            styles={{
	                  menuPortal: base => ({
	                    ...base,
	                    zIndex: 9999,
	                  }),
	                }}
	            options={resourceDataLevelEnum.map(e => ({label: e, value: e}))}
	            defaultValue={{label:this.state.data.resourceDataLevel, value:this.state.data.resourceDataLevel}}
	            onChange={this.handleChange('resourceDataLevel')}
	          />
			    </GridColumn>

					<GridColumn medium={12}>
					<div className="textarea">
			  	<FieldTextAreaStateless
						name="resourceDescription"
						label="Description:"
						style={{width:'100%'}}
			      value={this.state.data.resourceDescription}
			      onChange={this.handleChange('resourceDescription')}
			    /></div>
			  	</GridColumn>

				</Grid>
		  </div>
		);
	}
}
