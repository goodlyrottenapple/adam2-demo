import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import Fuse from 'fuse.js'
import { getOntology } from '../../utils/api'
import Header from '../Header';

export default class DUOTerms extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			terms:[]
    },
    fuse:null,
    duoTermsText:"",
    duoValues:[],
	}

  componentWillMount() {
    this.props.setData(this.state.data);
    const options = {
      // isCaseSensitive: false,
      // includeScore: false,
      // shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      // threshold: 0.6,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      keys: [
        "label",
        "value"
      ]
    };

    getOntology("https://www.ebi.ac.uk/ols/ontologies/duo/download", true)
			.then(({ status, json }) => {
				switch (status) {
					case 200:
						this.setState({fuse: new Fuse(json.map(e => ({label:e.value, value:e.label})), options)})
						break;
					default:
						console.error({
							message: `Loading the DUO ontology failed with the following error:`,
							description: json.detail,
            })
        }
      })
  }

  mkTrms = txt => {
    if(!this.state.fuse) return [];
    const resTerms = []
    const resValues = [];

    txt.split(',').forEach(w => {
      if(w.trim()){
        const res = this.state.fuse.search(w);
        if(res.length > 0) {
          resTerms.push({dataUseClass:res[0].item.label, dataUseClassOntology: "https://www.ebi.ac.uk/ols/ontologies/duo/download"})
          resValues.push(res[0].item.value)
        }
      }
    })

    return [resTerms, resValues]
  }
	handleChange = e => {
    const [terms, values] = this.mkTrms(e.target.value);
    const newData = {terms: terms};
    this.setState({duoTermsText: e.target.value, duoValues: values, data:newData});
    
		this.props.setData(newData);
	}

	render() {
		return (
      <div style={{padding:'0px 10px'}}>
        <div className="textarea">
          <Header style={{position: 'relative', top: '1.5em'}} name="duo_terms" advancedMode={this.props.advancedMode}/>
          <FieldTextAreaStateless
            name="resourceDescription"
            style={{width:'100%'}}
            value={this.state.duoTermsText}
            onChange={this.handleChange}
          />
        </div>
        <Header name="duo_terms_recognised" advancedMode={this.props.advancedMode}/>
        <ul style={{paddingLeft:'20px'}}>{this.state.duoValues && this.state.duoValues.map(k => (<li>{k}</li>))}</ul>
      </div>
		);
	}
}
