import React from 'react';

import InfoIcon from '@atlaskit/icon/glyph/info';
import { Tooltip } from 'antd';


const data = {
  terms_of_use_header: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris malesuada felis scelerisque tempus rhoncus. Sed eget ornare nulla. Maecenas eget lacus blandit, pellentesque sem eu, gravida velit."
}


function Info(props){
  return ('visible' in props && !props.visible ? null : 
    <Tooltip title={data[props.name] ? data[props.name] : "empty" } placement="right">
      <span style={{
        position: 'relative', 
        bottom: props.placement && props.placement === "h5" ? '-2px' : 'inherit'}}><InfoIcon label="Info" size="small"/></span>
    </Tooltip>)
}

export default Info;

