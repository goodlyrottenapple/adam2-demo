import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';

const resourceDataLevelEnum = ["UNKNOWN", "DATABASE", "METADATA", "SUMMARISED", "DATASET", "RECORDSET", "RECORD", "RECORDFIELD"]

export default class ResourceProperties extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			resourceName:'',
			resourceDescription: '',
			resourceDataLevel:resourceDataLevelEnum[0]
		},
	}


  componentDidMount() {
    this.props.setData(this.state.data);
  }


	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};
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
		  	<GridColumn medium={4}>
					<h5 style={{paddingBottom: '0.5em'}}>Resource name:</h5>
					<Textfield
						name="resourceName"
						defaultValue={this.state.data.resourceName}
						onChange={this.handleChange('resourceName')} 
					/>
		  	</GridColumn>
				<GridColumn medium={5}>
		  		<h5 style={{paddingBottom: '0.5em'}}>Data level:</h5>
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

				</Grid>
				
		  
		  <div style={{paddingTop: '1.5em'}}>
		  <Grid >
		  	<GridColumn medium={12}>
		  	<h5 style={{paddingBottom: '0.5em'}}>Description:</h5>
		  	<Textfield
		      name="resourceDescription"
		      defaultValue={this.state.data.resourceDescription}
		      onChange={this.handleChange('resourceDescription')} 
		    />
		  	</GridColumn>
			</Grid>
			</div>
		  
		  </div>
		);
	}
}
