import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';

const permissionModeEnum = ["UNKNOWN", "ALL_TERMS_PERMITTED_BY_DEFAULT", "ALL_TERMS_FORBIDDEN_BY_DEFAULT"]

export default class PermissionMode extends React.Component {

	state = this.props.data ? this.props.data : {
		permissionMode:permissionModeEnum[0]
	}


  componentDidMount() {
    this.props.setData(this.state);
  }


	handleChange = e =>  {
		const newData = {permissionMode:e.value};
		this.setState(newData);
		this.props.setData(newData);
	}



	render() {
		return (
		  <div>
		  <Grid>
		  	<GridColumn>
		  		<h5 style={{paddingBottom: '0.5em'}}>Permission Mode:</h5>
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
            options={permissionModeEnum.map(e => ({label: e, value: e}))}
            defaultValue={{label:this.state.permissionMode, value:this.state.permissionMode}}
            onChange={this.handleChange}
          />
		    </GridColumn>

				</Grid>
		  </div>
		);
	}
}
