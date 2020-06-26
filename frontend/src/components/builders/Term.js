import React from 'react';
import Select from '@atlaskit/select';
import { Grid, GridColumn } from '@atlaskit/page';
import Textfield from '@atlaskit/textfield';

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'

const restriction_ruleEnum = ["UNKNOWN", "NO_CONSTRAINTS", "CONSTRAINTS", "FORBIDDEN"]

export default class Term extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			data_use_class:null,
			restriction_class: {restriction_rule: "UNKNOWN", restriction_object:null, constraints_details:''}
		},
	}


  componentDidMount() {
    this.props.setData(this.state.data);
  }


	handleChange = prop_name => e =>  {
		const newData = {...this.state.data};

		if (prop_name === 'constraints_details'){
			newData.restriction_class[prop_name] = e.target.value;
		}
		else if (prop_name === "restriction_rule" || prop_name === "restriction_object"){
			newData.restriction_class[prop_name] = e.value;
    }
    else newData[prop_name] = e.value;

		this.setState({data: newData});
		this.props.setData(newData);
	}



	render() {
		return (
		  <div>
	      <Grid >
				<h4 style={{marginTop: '0.5em', marginLeft: '0.5em'}}>Term</h4>
			  	<GridColumn medium={12}>
			  		<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Data Use Class:</h5>
				  	{/* <Select
		            className="single-select"
		          	classNamePrefix="react-select"
		          	menuPortalTarget={document.body}
		            styles={{
		                  menuPortal: base => ({
		                    ...base,
		                    zIndex: 9999,
		                  }),
		                }}
		            options={["dummy1", "dummy2"].map(e => ({label: e, value: e}))}
		            defaultValue={{label:this.state.data.data_use_class, value:this.state.data.data_use_class}}
		            onChange={this.handleChange('data_use_class')}
		          /> */}
							<DropdownTreeSelect
								data={this.props.dataUseClassOntology}
								mode="radioSelect"
								onChange={this.handleChange('data_use_class')}
							/>
			  	</GridColumn>

	        <GridColumn medium={5}>
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
	            defaultValue={{label:this.state.data.restriction_class.restriction_rule, value:this.state.data.restriction_class.restriction_rule}}
	            onChange={this.handleChange('restriction_rule')}
	          />
			    </GridColumn>

	        <GridColumn medium={5}>
			  		<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Restriction Object:</h5>
	          {/*}<Select
	            className="single-select"
	          	classNamePrefix="react-select"
	          	menuPortalTarget={document.body}
	            styles={{
	                  menuPortal: base => ({
	                    ...base,
	                    zIndex: 9999,
	                  }),
	                }}
	            options={["dummy1", "dummy2"].map(e => ({label: e, value: e}))}
	            defaultValue={{label:this.state.data.restriction_class.restriction_object, value:this.state.data.restriction_class.restriction_object}}
	            onChange={this.handleChange('restriction_object')}
	          />*/}
						<DropdownTreeSelect
							data={this.props.restrictionObjectOntology}
							mode="radioSelect"
							onChange={this.handleChange('restriction_object')}
						/>
			    </GridColumn>

			  	<GridColumn medium={4}>
						<h5 style={{marginTop: '0.5em', paddingBottom: '0.5em'}}>Constraints Details:</h5>
						<Textfield
							name="resourceName"
							defaultValue={this.state.data.restriction_class.constraints_details}
							onChange={this.handleChange('constraints_details')}
						/>
			  	</GridColumn>

	      </Grid>

			</div>
		);
	}
}
