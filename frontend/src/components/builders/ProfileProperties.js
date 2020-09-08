import React from 'react';
import { DatePicker } from '@atlaskit/datetime-picker';
import { Tag, Tooltip } from 'antd';

import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';
import Header from '../Header';

const resourceDataLevelEnum = ["UNKNOWN", "DATABASE", "METADATA", "SUMMARISED", "DATASET", "RECORDSET", "RECORD", "RECORDFIELD"]

export default class PRofileProperties extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			profileName:'',
			profileVersion:'',
			profileUpdatedOn:[],
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

	addDate = date => {
		const newData = {...this.state.data};
		newData.profileUpdatedOn.push(date);
		this.setState({data: newData});
		this.props.setData(newData);
	}

	removeDate = i => () => {
		const newData = {...this.state.data};
		newData.profileUpdatedOn = newData.profileUpdatedOn.splice(i, 1);
		this.setState({data: newData});
		this.props.setData(newData);
	}

	render() {
		return (
		  <div>
			  <Grid>
			  	<GridColumn medium={12}>
						<Header style={{marginTop: '0.5em',paddingBottom: '0.5em'}} name="profile_name" advancedMode={this.props.advancedMode}/>
						<Textfield
							name="profileName"
							defaultValue={this.state.data.profileName}
							onChange={this.handleChange('profileName')}
						/>
			  	</GridColumn>

					<GridColumn >
						<Header style={{marginTop: '0.5em',paddingBottom: '0.5em'}} name="profile_version" advancedMode={this.props.advancedMode}/>
						<Textfield
							name="profileVersion"
							defaultValue={this.state.data.profileVersion}
							onChange={this.handleChange('profileVersion')}
						/>
			  	</GridColumn>

					<GridColumn>
						<Header style={{marginTop: '0.5em',paddingBottom: '0.5em'}} name="updated_on" advancedMode={this.props.advancedMode}/>
						<div style={{minHeight: '40px', maxHeight:'100px', overflow:'scroll', paddingBottom:'1.5em'}}>
						{[...this.state.data.profileUpdatedOn].map((date, i) => {return (<Tag
								closable
								onClose={this.removeDate(i)}
								// style={{}}
							><span style={{width: '75px', 
								fontFamily: 'monospace', 
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								display: 'inline-block',
								float: 'left',
								paddingTop: '1px',
								}}>{date}</span></Tag>)})}
						</div>

						<DatePicker
							id="profileUpdatedOn"
							value={this.state.data.profileUpdatedOn.length > 0 ? this.state.data.profileUpdatedOn[this.state.data.profileUpdatedOn.length - 1] : Date.now()}
							onChange={e => this.addDate(e)}
							locale={"en-UK"}
						/>
			  	</GridColumn>

				</Grid>
		  </div>
		);
	}
}
