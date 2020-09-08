import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import Header from '../Header';

const permissionModeEnum = ["UNSPECIFIED", "ALL_UNSTATED_TERMS_PERMITTED_BY_DEFAULT", "ALL_UNSTATED_TERMS_FORBIDDEN_BY_DEFAULT"]

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
					<Header style={{paddingBottom: '0.5em'}} name="permission_mode" advancedMode={this.props.advancedMode}/>
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
