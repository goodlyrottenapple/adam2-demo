import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';
import Button from '@atlaskit/button';
import { notification } from 'antd';
import '../../antd.css';
// import 'antd/dist/antd.css';

import DropdownContainer from '../DropdownContainer';
import { getOntology , getAvailableOntologies } from '../../utils/api'

const restriction_ruleEnum = ["UNKNOWN", "NO_CONSTRAINTS", "CONSTRAINTS", "FORBIDDEN"]

export default class Term extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			dataUseClass:null,
			dataUseClassOntology: "https://www.ebi.ac.uk/ols/ontologies/duo/download",
			restrictionClass: {restrictionRule: "UNKNOWN", restrictionObject:null, restrictionObjectOntology:null, constraintsDetails:null}
		},
		availableOntologies:[],
		dataUseClassOntology: [],
		restrictionObjectOntology: [],
	}

	componentWillMount() {
		getAvailableOntologies().then(availableOntologies => getOntology("https://www.ebi.ac.uk/ols/ontologies/duo/download").then(({status , json}) => {
			switch (status) {
				case 200:
					this.setState({
						availableOntologies: availableOntologies
							// .filter(o => o.status === "ok")
							.map(o => ({label: o.abbrev + " - " + o.label, value: o.url + "/download", abbrev:o.abbrev})),
						dataUseClassOntology: json
					})
			}
		}))
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
				<h4>Term</h4>
				<GridColumn medium={14}>
				{this.props.advancedMode ? 
					<div style={{marginTop: '0.5em', display:'flex'}}>
						<div></div>
						<h5 style={{flexGrow:'4'}} >Data Use Class:</h5>

						<h5>Active onotology:</h5>
						<div style={{paddingLeft:'5px', paddingBottom:'3px', flexGrow:'2'}}>
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
							options={this.state.availableOntologies}
							defaultValue={{label:"DUO - The Data Use Ontology", value:"https://www.ebi.ac.uk/ols/ontologies/duo/download"}}
							onChange={e => {
								notification.info({
									message: `Fetching the ${e.abbrev ? e.abbrev : e.value} ontology...`,
								});

								getOntology(e.value)
									.then(({ status, json }) => {
										switch (status) {
											case 200:
												notification.success({
													message: `${e.abbrev ? e.abbrev : e.value} ontology successfully loaded...`,
												});
												this.setState({
													data: {...this.state.data, dataUseClassOntology : e.value}, 
													dataUseClassOntology: json
												})
												break;
											default:
												notification.error({
													message: `Loading the ${e.abbrev ? e.abbrev : e.value} ontology failed with the following error:`,
													description: json.detail,
												});

										}
									});
							}}
						/>
						</div>
					</div> 
				:
					<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Data Use Class:</h5>
				}

					<DropdownContainer
						data={this.state.dataUseClassOntology}
						mode="radioSelect"
						texts={{placeholder: this.state.dataUseClassOntology.length === 0 ? "Please select an ontology from the Active ontology dropdown above..." : "Select a Data Use Class term..."}}
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
					{/* <h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Restriction Object:</h5> */}

					<div style={{marginTop: '0.5em', display:'flex'}}>
						<div></div>
						<h5 style={{flexGrow:'4'}}>Restriction Object:</h5>

						<h5>Active onotology:</h5>
						<div style={{paddingLeft:'5px', paddingBottom:'3px', flexGrow:'2'}}>
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
							options={this.state.availableOntologies}

							onChange={e => {
								notification.info({
									message: `Fetching the ${e.abbrev ? e.abbrev : e.value} ontology...`,
								});

								getOntology(e.value)
									.then(({ status, json }) => {
										switch (status) {
											case 200:
												notification.success({
													message: `${e.abbrev ? e.abbrev : e.value} ontology successfully loaded...`,
												});
												this.setState({
													data: {...this.state.data, restrictionClass : {...this.state.data.restrictionClass, restrictionObjectOntology: e.value}}, 
													restrictionObjectOntology: json
												})
												break;
											default:
												notification.error({
													message: `Loading the ${e.abbrev ? e.abbrev : e.value} ontology failed with the following error:`,
													description: json.detail,
												});

										}
									});
							}}

						/>
						</div>
					</div>

					<DropdownContainer
						data={this.state.restrictionObjectOntology}
						mode="radioSelect"
						texts={{placeholder: this.state.dataUseClassOntology.length === 0 ? "Please select an ontology from the Active ontology dropdown above..." : "Select a Restriction Object term..."}}
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
