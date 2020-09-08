import React from 'react';

import InfoIcon from '@atlaskit/icon/glyph/info';
import { Tooltip } from 'antd';


const data = {
  term_of_use: {
    title: "Something else",
    title_advance_mode: "Term of use",
    info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris malesuada felis scelerisque tempus rhoncus. Sed eget ornare nulla. Maecenas eget lacus blandit, pellentesque sem eu, gravida velit."
  },
  data_use_class: {
    title: "Data Use Class:",
    info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris malesuada felis scelerisque tempus rhoncus. Sed eget ornare nulla. Maecenas eget lacus blandit, pellentesque sem eu, gravida velit."
  },
  restriction_rule: {
    title: "Restriction Rule:"
  },
  restriction_object: {
    title: "Restriction object:"
  },
  constraint_details: {
    title: "Constraint details:",
    info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris malesuada felis scelerisque tempus rhoncus. Sed eget ornare nulla. Maecenas eget lacus blandit, pellentesque sem eu, gravida velit."
  },
  duo_terms: {
    title: "DUO terms:",
  },
  duo_terms_recognised: {
    title: "Recognised DUO terms:",
  },
  profile_name: {
    title: "Profile name:"
  },
  profile_version: {
    title: "Profile version:"
  },
  updated_on: {
    title: "Updated on:"
  },
  profile_references: {
    title: "Profile Reference (Citation, URL, DOI, etc.):"
  },
  contact_name: {
    title: "Contact Name:"
  },
  contact_email: {
    title: "Contact Email:"
  },
  resource_organisations: {
    title: "Resource Organisations:"
  },
  resource_name: {
    title: "Resource name:"
  },
  resource_description: {
    title: "Description:"
  },
  resource_references: {
    title: "Resource Reference (Citation, URL, DOI, etc.):"
  },
  data_level: {
    title: "Data Level:"
  },
  permission_mode: {
    title: "Permission mode:"
  },
  sharing_mode: {
    title: "Sharing mode:"
  }
}


function Header(props){
  return (
    props.size === "large" ? 
      <h4 style={props.style} className="restriction-label">{props.advancedMode && data[props.name].title_advance_mode ? data[props.name].title_advance_mode : data[props.name].title}&nbsp;
      {data[props.name].info && <Tooltip title={data[props.name].info} placement="right">
        <span style={{
          position: 'relative', 
          bottom: 'inherit'}}><InfoIcon label="Info" size="small"/></span>
      </Tooltip>}</h4> :
      <h5 style={props.style} className="restriction-label">{props.advancedMode && data[props.name].title_advance_mode ? data[props.name].title_advance_mode : data[props.name].title}&nbsp;
      {data[props.name].info && <Tooltip title={data[props.name].info} placement="right">
        <span style={{
          position: 'relative', 
          bottom: '-2px'}}><InfoIcon label="Info" size="small"/></span>
      </Tooltip>}</h5>)
}

export default Header;

