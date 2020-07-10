import React, { Component } from 'react';
import PageTitle from '../components/PageTitle';
import Textfield from '@atlaskit/textfield';
import Dropzone from 'react-dropzone';
import { saveAs } from 'file-saver';
import * as localForage from "localforage";

// import styled from 'styled-components';
import Tree, {
  mutateTree,
  moveItemOnTree,
  addItemToTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
  TreeSourcePosition,
  TreeDestinationPosition,
} from '@atlaskit/tree';
import ToggleStateless from '@atlaskit/toggle';
import Button, { ButtonGroup } from '@atlaskit/button';
import { Grid, GridColumn } from '@atlaskit/page';
import Select from '@atlaskit/select';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { AkCodeBlock } from '@atlaskit/code';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Info from '@atlaskit/icon/glyph/info';
import Error from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

import { typeMap } from '../components/types'

import './MainPage.css'

const PADDING_PER_LEVEL = 30;

const mergeObjs = (a,b) => {
  if(a === undefined) return b;
  if(b === undefined) return a;
  switch(typeof a){
    case "object":
      if(Array.isArray(a)){
        if(Array.isArray(b)) return [...a, ...b]
        else return [...a, b]
      } else {
        const ret = {}
        for (var key in a) {
          if(b[key] === undefined) ret[key] = a[key]
          else ret[key] = mergeObjs(a[key], b[key])
        }

        for (var key in b) {
          if(a[key] === undefined) ret[key] = b[key]
        }
        return ret
      }
    default:
      return a
  }
}


const removeNulls = (o) => {
  switch(typeof o){
    case "object":
      if(Array.isArray(o)){
        return o.map(x => removeNulls(x))
      } else {
        const ret = {...o}
        for (var key in ret) { 
          if(ret[key] === null) delete ret[key]
          else ret[key] = removeNulls(ret[key])
        }
        return ret
      }
    default:
      return o
  }
}

const collectChildren = (tree, children, isRoot = false) => {
  return children.map(c => {
    const res = tree.items[c].children.length > 0 ? {...tree.items[c].data, child_terms: collectChildren(tree, tree.items[c].children)} : tree.items[c].data;
    if(isRoot && tree.items[c].rootNesting) return tree.items[c].rootNesting(res)
    else return res;
  });
}

const builders = Object.keys(typeMap).filter(e => 'type' in typeMap[e]).map(e => {return {
  value:e,
  label: typeMap[e].label,
  canHaveChildren:typeMap[e].canHaveChildren,
  childrenType:typeMap[e].childrenType,
  rootNesting:typeMap[e].rootNesting,
}})

const readTextFile =(file) => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result)
    };
    fr.readAsText(file);
  });
}


const iconMap = (key) => {
  const icons = {
    info: <Info label="Info icon" primaryColor={colors.B300} />,
    success: <Tick label="Success icon" primaryColor={colors.G300} />,
    // warning: (
      // <Warning label="Warning icon" primaryColor={color || colors.Y300} />
    // ),
    error: <Error label="Error icon" primaryColor={colors.R300} />,
  };

  return icons[key];
};


export default class MainPage extends Component<Props, State> {

  state = {
    counter:0,
    flags:[],
    ontologies:{},
    dataUseClassOntology: null,
    restrictionObjectOntology: null,
    ontoURL:'',
    advancedMode:false,
    tree: {
      rootId: 'root',
      items: {
        'root': {
          id: 'root',
          children: [],
          hasChildren: true,
          isExpanded: true,
          isChildrenLoading: false,
          canHaveChildren: true
        },
      },
    }
  }

  flagCount = 0;

  // componentDidMount() {
  //   fetch(
  //     process.env.REACT_APP_API_URL+"/discovery/loadSettings?id="+this.props.match.params.id, {
  //       headers: {
  //         "Access-Control-Allow-Origin": "*",
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //         'X-Requested-With': 'XMLHttpRequest'
  //       }
  //     })
  //     .then(res => res.json())
  //     .then(
  //       (result) => {
  //         // console.log("Tree: ");
  //         if(result){
  //           const newTree = JSON.parse(result)

  //           const items = Object.keys(newTree.items);
  //           var maxVal = 0, v;
  //           for (var i = 0; i < items.length; i++) {
  //             v = parseInt(items[i]);
  //             if(v > maxVal) maxVal = v;
  //           }

  //           this.setState({
  //             tree: newTree,
  //             counter: maxVal+1
  //           });
  //         }
  //       },
  //       // Note: it's important to handle errors here
  //       // instead of a catch() block so that we don't swallow
  //       // exceptions from actual bugs in components.
  //       (error) => {
  //         this.setState({
  //           error: error
  //         });
  //       }
  //     )
  // }

  storeData = (id) => {
    return (data) => this.setState(prevState => {
      var newTree = {...prevState.tree}
      newTree.items[id].data = data
      return { tree: newTree }
    })
  }

  renderBuilderFromTreeItem = (item: TreeItem) => {
    const TypeTag = typeMap[item.type].type
    return <TypeTag
      setData={this.storeData(item.id)}
      data={item.data}
      label={typeMap[item.type].label}
      settings_id={this.props.match.params.id}
      advancedMode={this.state.advancedMode}
      addFlag={this.addFlag}
      // {...(item.type === "Term" ? {
      //   dataUseClassOntology: this.state.dataUseClassOntology ? this.state.ontologies[this.state.dataUseClassOntology] : [],
      //   restrictionObjectOntology: this.state.restrictionObjectOntology ? this.state.ontologies[this.state.restrictionObjectOntology] : []
      // } : {})}
    />
  }

  renderItem = ({ item, onExpand, onCollapse, provided }: RenderItemParams) => {

    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}

      >
        <div style={{
          backgroundColor:'white',
          borderColor: 'rgb(222, 235, 255)',
          borderRadius: '3px',
          borderWidth: '2px',
          borderStyle: 'solid',
          padding: '10px',
          marginTop: '5px',
        }}>
        <Grid spacing="compact">
          <GridColumn medium={1}>
            <Button appearance={'subtle'} spacing="none" onClick={() => this.onDelete(item.id)}>
              <CrossIcon/>
            </Button>
          </GridColumn>
          <GridColumn medium={11}>
            {this.renderBuilderFromTreeItem(item)}
          </GridColumn>
        </Grid>
        </div>
      </div>
    );
  };


  createTreeItem = (id: string, ty: string, canHaveChildren, childrenType, rootNesting) => {
    return {
      id: id,
      children: [],
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      canHaveChildren: canHaveChildren,
      childrenType:childrenType,
      rootNesting:rootNesting,
      type: ty,
    };
  };

  addItemToRoot = (tree: TreeData, id: string, ty: string, canHaveChildren, childrenType:string[], rootNesting) => {
    // const destinationParent = tree.items[position.parentId];
    const newItems = {...tree.items};
    newItems[`${id}`] = this.createTreeItem(id, ty, canHaveChildren, childrenType, rootNesting);
    newItems['root'].children.push(`${id}`);
    return {
      rootId:tree.rootId,
      items: newItems
    }
  }

  deleteItem = (tree: TreeData, id: string) => {
    const newItems = {...tree.items};
    delete newItems[`${id}`];

    for (var i of Object.keys(newItems)) {
      if (newItems[i].children.includes(`${id}`)) {
        newItems[i].children.splice(newItems[i].children.indexOf(`${id}`), 1);
      }
    }

    return {
      rootId:tree.rootId,
      items: newItems
    }
  }

  onDelete = (id: string) => {
    const { counter, tree, queries } = this.state;
    const newTree = this.deleteItem(tree, id);
    const newQueries = {...queries}
    delete newQueries[id];

    this.setState({
      tree: newTree,
    });
  }

  onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    const { tree } = this.state;

    if (!destination) {
      return;
    }

    console.log(tree.items[tree.items[source.parentId].children[source.index]].type);

    if(!tree.items[destination.parentId].canHaveChildren
       ||
      (tree.items[destination.parentId].childrenType && !tree.items[destination.parentId].childrenType.includes(tree.items[tree.items[source.parentId].children[source.index]].type))
    ){
      return;
    }
    const newTree = moveItemOnTree(tree, source, destination);
    this.setState({
      tree: mutateTree(newTree, destination.parentId, { isExpanded: true }),
    });
  };

  handleChange = selectedOption => this.setState((prevState) => {
    const { counter, tree } = prevState;
    const newTree = this.addItemToRoot(tree, counter, selectedOption.value, selectedOption.canHaveChildren, selectedOption.childrenType, selectedOption.rootNesting);
    return {
      counter: counter+1,
      tree: newTree,
    }
  })


  mkADAM(tree){
    return removeNulls(collectChildren(tree, tree.items.root.children, true).reduce((acc,c) => mergeObjs(acc,c), {}))
  }

  saveADAM = () => {
    const blob = new Blob([JSON.stringify(this.mkADAM(this.state.tree), null, 2)], {type: "application/json;charset=utf-8"});
    saveAs(blob, "adam.json");
  }

  addBuilder = (o, ty) => {
    const { counter, tree } = this.state;
    const newTree = this.addItemToRoot(tree, counter, ty, typeMap[ty].canHaveChildren, typeMap[ty].childrenType, typeMap[ty].rootNesting);
    newTree.items[`${counter}`].data = o

    this.setState({
      counter: counter+1,
      tree: newTree,
    });
  }

  loadADAMaux = o => {
    if('profileName' in o){
      const ty = 'ProfileProperties';
      this.addBuilder({profileName:o.profileName, profileVersion:o.profileVersion, profileCreateDate:o.profileCreateDate}, ty);
    }
    if('profileReferences' in o){
      const ty = 'ProfileReferences';
      o.profileReferences.map(r => this.addBuilder({profileReferences: [r]}, ty))
    }
    if('resourceName' in o){
      const ty = 'ResourceProperties';
      this.addBuilder({resourceName:o.resourceName, resourceDataLevel:o.resourceDataLevel, resourceDescription:o.resourceDescription}, ty);
    }
    if('resourceReferences' in o){
      const ty = 'ResourceReferences';
      o.resourceReferences.map(r => this.addBuilder({resourceReferences: [r]}, ty))
    }
    if('resourceContacts' in o){
      const ty = 'ResourceContact';
      o.resourceContacts.map(r => this.addBuilder({resourceContacts: [r]}, ty))
    }
    if('resourceOrganisations' in o){
      const ty = 'ResourceOrganisations';
      o.resourceOrganisations.map(r => this.addBuilder({resourceOrganisations: [r]}, ty))
    }
    if('sharingMode' in o){
      const ty = 'SharingMode';
      this.addBuilder({sharingMode:o.sharingMode}, ty);
    }
    if('permissionMode' in o){
      const ty = 'PermissionMode';
      this.addBuilder({permissionMode:o.permissionMode}, ty);
    }
  }

  loadADAM = (acceptedFiles) => acceptedFiles.forEach((file) => {
    const ext = file.path.split('.').pop().toLowerCase()
    if(ext === 'json') {
      readTextFile(file).then((result) => {
        const res = JSON.parse(result)
        this.setState({
          counter:0,
          tree: {
            rootId: 'root',
            items: {
              'root': {
                id: 'root',
                children: [],
                hasChildren: true,
                isExpanded: true,
                isChildrenLoading: false,
                canHaveChildren: true
              },
            },
          }
        });
        this.loadADAMaux(res)
      
        
      })
    }
  })

  componentWillMount = () => {
    localForage.config({
      name        : 'adam2-demo',
      version     : 1.0,
      storeName   : 'ontologies', // Should be alphanumeric, with underscores.
      description : 'Offline store of previously loaded ontologies'
    });
  }


  addFlag = (title, message, icon = 'success', override = true) => this.setState(prevState => {
    if(override) {
      this.flagCount = 0;
      return {flags: [{
        created: Date.now(),
        description: message,
        icon: iconMap(icon),
        id: 1,
        key: 1,
        title: title,
      }]}
    }
    const flags = prevState.flags.slice();
    const index = this.flagCount++;
    flags.unshift({
      created: Date.now(),
      description: message,
      icon: iconMap(icon),
      id: index,
      key: index,
      title: title,
    });
    return { flags: flags }
  });

  dismissFlag = () => {
    this.setState(state => ({ flags: state.flags.slice(1) }));
    this.flagCount--;
  };

  render() {
    const { tree } = this.state;
    return (
      <Dropzone onDrop={this.loadADAM}>
      {({getRootProps}) => (<div className="content" {...getRootProps()}>
        <PageTitle>ADA-M 2.0 demo</PageTitle>
        <div className="cols">
          <div className="col1">
            <h4 style={{paddingBottom:'10px'}}>Profile Options:</h4>
            <div style={{marginTop:'0px'}}>
              {/* <h4 style={{paddingBottom:'10px'}}>Add a property:</h4> */}
              <Select
                options={builders}
                onChange={this.handleChange}
                isOptionDisabled={option => 
                  !typeMap[option.value].multipleInstances && 
                  Object.keys(this.state.tree.items)
                    .map(k => this.state.tree.items[k].type ? this.state.tree.items[k].type : "")
                    .includes(option.value)}
                placeholder="Select a property to add the the ADA-M profile..." />
            </div>
            

            <div style={{marginTop:'23px', display:'flex'}}>
              <ToggleStateless isDefaultChecked={this.state.advancedMode} onChange={() => this.setState({advancedMode: !this.state.advancedMode})}/>
              <span style={{paddingTop:'4px'}}>Advanced mode</span>
            </div>

          </div>

          <div className="col2">
            <Tree
              tree={tree}
              renderItem={this.renderItem}
              onDragEnd={this.onDragEnd}
              offsetPerLevel={PADDING_PER_LEVEL}
              isDragEnabled
              isNestingEnabled
            />

          </div>

          <div className="col3">
            <h4 style={{paddingTop:'0px', paddingBottom:'10px'}}>ADA-M profile:</h4>
            <AkCodeBlock
              language="json"
              text={JSON.stringify(this.mkADAM(this.state.tree), null, 2)}
              showLineNumbers={false}/>
              <Button appearance="primary" style={{marginTop:'10px'}} onClick={this.saveADAM}>Download ADA-M profile</Button>

            {/* <h4 style={{paddingTop:'0px', paddingBottom:'10px'}}>debug:</h4>
            <AkCodeBlock
              language="json"
              text={JSON.stringify(this.state.tree, null, 2)}
              showLineNumbers={false}/> */}
          </div>
        </div>
        <FlagGroup onDismissed={this.dismissFlag}>
          {this.state.flags.map(flag => (
            <AutoDismissFlag {...flag} />
          ))}
        </FlagGroup>
      </div>)}
      </Dropzone>
    );
  }
}
