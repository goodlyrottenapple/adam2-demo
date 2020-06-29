import React, { Component } from 'react';
import ContentWrapper from '../components/ContentWrapper';
import PageTitle from '../components/PageTitle';
import Textfield from '@atlaskit/textfield';

import styled from 'styled-components';
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
import Button, { ButtonGroup } from '@atlaskit/button';
import { Grid, GridColumn } from '@atlaskit/page';
import Select from '@atlaskit/select';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { AkCodeBlock } from '@atlaskit/code';


import { typeMap } from '../components/types'


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

export default class MainPage extends Component<Props, State> {

  state = {
    counter:0,
    ontologies:{},
    dataUseClassOntology: null,
    restrictionObjectOntology: null,
    ontoURL:'',
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
    return (data) => {
      var newTree = {...this.state.tree}
      newTree.items[id].data = data

      this.setState({
        tree: newTree,
      });
    }
  }

  renderBuilderFromTreeItem = (item: TreeItem) => {
    const TypeTag = typeMap[item.type].type
    return <TypeTag
      setData={this.storeData(item.id)}
      data={item.data}
      label={typeMap[item.type].label}
      settings_id={this.props.match.params.id}
      {...(item.type === "Term" ? {
        dataUseClassOntology: this.state.dataUseClassOntology ? this.state.ontologies[this.state.dataUseClassOntology] : [],
        restrictionObjectOntology: this.state.restrictionObjectOntology ? this.state.ontologies[this.state.restrictionObjectOntology] : []
      } : {})}
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

  handleChange = selectedOption => {
    const { counter, tree } = this.state;
    const newTree = this.addItemToRoot(tree, counter, selectedOption.value, selectedOption.canHaveChildren, selectedOption.childrenType, selectedOption.rootNesting);
    this.setState({
      counter: counter+1,
      tree: newTree,
    });
  };

  // saveTree = () => {
  //   fetch(
  //     process.env.REACT_APP_API_URL+"/discovery/saveSettings", {
  //       method:'POST',
  //       headers: {
  //         'Access-Control-Allow-Origin': '*',
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //         'X-Requested-With': 'XMLHttpRequest'
  //       },
  //       body: JSON.stringify({id: this.props.match.params.id, data:this.state.tree})
  //     })
  //     .then(res => res.json())
  //     .then(
  //       (result) => {
  //         console.log(result);
  //       },
  //       // Note: it's important to handle errors here
  //       // instead of a catch() block so that we don't swallow
  //       // exceptions from actual bugs in components.
  //       (error) => {
  //         console.log(error);
  //       })
  // }

  loadOntologies = () => {
    fetch(
      process.env.REACT_APP_API_URL+"/loadOntologies",
      {
        method:'POST',
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    )
    .then(res => res.json())
    .then(res => {
      // Load each ontology from disk into the dropdown
      for (var i = 0; i < res.length; i++) {
        this.setState({ontologies: {...this.state.ontologies, [res[i]['name']]: res[i]['content']}})
      }
    });
  }

  addOntology = () => {
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
        body: JSON.stringify({'url': this.state.ontoURL})
      }
    )
    .then(res => res.json())
    .then(res => {
      this.setState({ontologies: {...this.state.ontologies, [this.state.ontoURL]: res}})
    });
  }

  mkADAM(tree){
    return collectChildren(tree, tree.items.root.children, true).reduce((acc,c) => mergeObjs(acc,c), {})
  }

  componentDidMount = () => {
    this.loadOntologies()
  }

  render() {
    const { tree } = this.state;
    return (
      <ContentWrapper>
        <PageTitle>ADA-M 2.0 demo</PageTitle>
        <Grid>

          <GridColumn medium={4}>
            <h4 style={{marginTop:'23px', paddingBottom:'10px'}}>Profile Options:</h4>
            <div style={{marginTop:'0px'}}>
              {/* <h4 style={{paddingBottom:'10px'}}>Add a property:</h4> */}
              <Select
                options={builders}
                onChange={this.handleChange}
                placeholder="Select a property to add" />
            </div>

            <h4 style={{marginTop:'23px', paddingBottom:'10px'}}>Ontology Sources:</h4>
            <div style={{marginTop:'0px'}}>
              <Textfield
                name="ontoURL"
                defaultValue={this.state.ontoURL}
                onChange={e => this.setState({ontoURL: e.target.value})}
              />
              <Button appearance="primary" onClick={this.addOntology}>Add Ontology</Button>
            </div>
            <div style={{marginTop:'0px'}}>
              <h4 style={{paddingBottom:'10px'}}>Active data use class ontology:</h4>
              <Select
                options={Object.keys(this.state.ontologies).map(k => ({label: k, value: k}))}
                onChange={e => this.setState({dataUseClassOntology: e.value})}
                placeholder="Select active data use class ontology" />
              <h4 style={{paddingBottom:'10px'}}>Active restriction object ontology:</h4>
              <Select
                options={Object.keys(this.state.ontologies).map(k => ({label: k, value: k}))}
                onChange={e => this.setState({restrictionObjectOntology: e.value})}
                placeholder="Select active restriction object ontology" />
            </div>
          </GridColumn>

          <GridColumn medium={8}>
            <Tree
              tree={tree}
              renderItem={this.renderItem}
              onDragEnd={this.onDragEnd}
              offsetPerLevel={PADDING_PER_LEVEL}
              isDragEnabled
              isNestingEnabled
            />
            <div style={{marginTop:'0px'}}>
            {/* <Button appearance="primary" onClick={this.saveTree}>Save settings</Button> */}
            </div>
            <h4 style={{paddingTop:'0px', paddingBottom:'10px'}}>ADA-M profile:</h4>
            <AkCodeBlock
              language="json"
              text={JSON.stringify(this.mkADAM(this.state.tree), null, 2)}
              showLineNumbers={false}/>
          </GridColumn>

        </Grid>
      </ContentWrapper>
    );
  }
}
