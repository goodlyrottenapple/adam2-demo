import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';

const sharingModeEnum = ["UNKNOWN", "DISCOVERY", "ACCESS", "DISCOVERY_AND_ACCESS"]

export default class SharingMode extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			sharingMode:sharingModeEnum[0]
		},
	}


  componentDidMount() {
    this.props.setData(this.state.data);
  }


	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};
		newData[prop_name] = e.value;
		this.setState({data: newData});
		this.props.setData(newData);
	}


	
	render() {
		return (
		  <div>
		  <Grid>
		  	<GridColumn>
		  		<h5 style={{paddingBottom: '0.5em'}}>Sharing mode:</h5>
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
            options={sharingModeEnum.map(e => ({label: e, value: e}))}
            defaultValue={{label:this.state.data.sharingMode, value:this.state.data.sharingMode}}
            onChange={this.handleChange('sharingMode')} 
          />
		    </GridColumn>

				</Grid>
		  </div>
		);
	}
}
