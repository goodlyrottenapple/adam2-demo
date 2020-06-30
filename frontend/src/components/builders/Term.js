import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';

import DropdownContainer from '../DropdownContainer'

const restriction_ruleEnum = ["UNKNOWN", "NO_CONSTRAINTS", "CONSTRAINTS", "FORBIDDEN"]

export default class Term extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			dataUseClass:null,
			restrictionClass: {restrictionRule: "UNKNOWN", restrictionObject:null, constraintsDetails:''}
		},
	}


  componentDidMount() {
    this.props.setData(this.state.data);
  }


	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};

		if (prop_name === 'constraintsDetails'){
			newData.restrictionClass[prop_name] = e.target.value;
		}
		else if (prop_name === "restrictionRule" || prop_name === "restrictionObject"){
			newData.restrictionClass[prop_name] = e.value;
    }
    else newData[prop_name] = e.value;

		this.setState({data: newData});
		this.props.setData(newData);
	}



	render() {
		return (
			<Grid>
				<h4 style={{marginTop: '0.5em', marginLeft: '0.5em'}}>Term</h4>
				<GridColumn medium={14}>
					<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Data Use Class:</h5>
						<DropdownContainer
							data={this.props.dataUseClassOntology}
							mode="radioSelect"
							onChange={this.handleChange('dataUseClass')}
						/>
				</GridColumn>

				<GridColumn medium={14}>
					<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Restriction Rule:</h5>
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
						options={restriction_ruleEnum.map(e => ({label: e, value: e}))}
						defaultValue={{label:this.state.data.restrictionClass.restrictionRule, value:this.state.data.restrictionClass.restrictionRule}}
						onChange={this.handleChange('restrictionRule')}
					/>
				</GridColumn>

				<GridColumn medium={14}>
					<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Restriction Object:</h5>
					<DropdownContainer
						data={this.props.restrictionObjectOntology}
						mode="radioSelect"
						onChange={this.handleChange('restrictionObject')}
					/>
				</GridColumn>

				<GridColumn medium={14}>
					<div className="textarea">
					<FieldTextAreaStateless
						name="resourceName"
						label="Constraints Details:"
						value={this.state.data.restrictionClass.constraintsDetails}
						onChange={this.handleChange('constraintsDetails')}
					/>
					</div>
				</GridColumn>

			</Grid>

		);
	}
}
