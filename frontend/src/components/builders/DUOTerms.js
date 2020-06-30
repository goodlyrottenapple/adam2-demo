import React from 'react';
import { Grid, GridColumn } from '@atlaskit/page';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import Fuse from 'fuse.js'

export default class DUOTerms extends React.Component {

	state = {
		data: this.props.data ? this.props.data : {
			terms:[]
    },
    fuse:null,
    duoTermsText:"",
    duoValues:[],
	}

  componentDidMount() {
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

    let duoTerms = localStorage.getItem('adam2demoDUOTerms')
    if(duoTerms){
      duoTerms = JSON.parse(duoTerms)
      console.log(duoTerms, Object.keys(duoTerms))
      const fuse = new Fuse(Object.keys(duoTerms).map(k => ({label: k, value:duoTerms[k]})), options);
      this.setState({fuse: fuse});
    } else {
      fetch(
        process.env.REACT_APP_API_URL+"/getOntology",
        {
          method:'POST',
          headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({url: 'http://purl.obolibrary.org/obo/duo.owl', collapseTree:true})
        }
      )
      .then(res => res.json())
      .then(res => {
        const fuse = new Fuse(Object.keys(duoTerms).map(k => ({label: k, value:duoTerms[k]})), options);
        this.setState({fuse: fuse});
        localStorage.setItem('adam2demoDUOTerms', JSON.stringify(res))
      });
    }
  }

  mkTrms = txt => {
    if(!this.state.fuse) return [];
    const resTerms = []
    const resValues = [];

    txt.split(',').forEach(w => {
      if(w.trim()){
        const res = this.state.fuse.search(w);
        if(res.length > 0) {
          resTerms.push({dataUseClass:res[0].item.label})
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
      <div>
        <div className="textarea">
        <FieldTextAreaStateless
          name="resourceDescription"
          label="DUO terms:"
          style={{width:'100%'}}
          value={this.state.duoTermsText}
          onChange={this.handleChange}
        /></div>
        <h5>Recognised DUO terms:</h5>
        <ul style={{paddingLeft:'20px'}}>{this.state.duoValues.map(k => (<li>{k}</li>))}</ul>
      </div>
		);
	}
}
