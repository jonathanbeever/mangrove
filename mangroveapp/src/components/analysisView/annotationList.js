import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { ListSubheader, Collapse, IconButton } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons/';
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios';

const styles = {
  root: {
    overflow: 'auto',
    maxHeight: 600
  }
}

class AnnotationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: null,
      editing: false
    }
  }

  handleEditClick = (e) => this.setState({ editing: !this.state.editing });

  handleDeleteAnnotation = (annotationId, author, e) => {
    const url = `http://127.0.0.1:34251/annotations/${annotationId}`;

    axios.delete(url, {
      params: {
        author
      }
    });
  }

  // Modify state to toggle annotation list item opened/closed
  handleExpandClick = (index, e) => {
    if (this.state.opened === index) this.setState({ opened: null });
    else this.setState({ opened: index });
  }

  render () {
    const { annotations, graph } = this.props;
    const user = window.localStorage.getItem('email');

    let annotationsFiltered;
    if (annotations !== undefined) annotationsFiltered = annotations.filter(annotation => annotation.annotationGraph === graph);
    else annotationsFiltered = [];

    return (
      <List
        component="div"
        subheader={
          <ListSubheader component="div">
            Annotations
            <IconButton variant="contained" size="small" aria-label="edit" onClick={this.handleEditClick}>
              <Edit />
            </IconButton>
          </ListSubheader>
        }
      >
        {
          (annotationsFiltered !== undefined) 
          ? annotationsFiltered.map((annotation, index, arrayObj) => {
            return (
              <React.Fragment key={index}>
                <ListItem button onClick={(e) => this.handleExpandClick(index, e)} key={index}>
                  <ListItemText primary={annotation.annotation} />
                  { !this.state.editing 
                    ? (this.state.opened === index 
                      ? <ExpandLess /> 
                      : <ExpandMore />
                    ) 
                    : <IconButton disabled={annotation.author !== user} onClick={(e) => this.handleDeleteAnnotation(annotation.annotationId, annotation.author, e)} color="secondary" ><Delete /></IconButton>
                  }
                </ListItem>
                <Collapse in={this.state.opened === index && !this.state.editing} timeout="auto" unmountOnExit key={10}>
                  <List component="div" disablePadding>
                    <ListItem button key={annotation.dataPoint.X}>
                      <ListItemText primary={`X: ${annotation.dataPoint.X}`} />
                    </ListItem>
                    <ListItem button key={annotation.dataPoint.Y}>
                      <ListItemText primary={`Y: ${annotation.dataPoint.Y}`} />
                    </ListItem>
                  </List>
                </Collapse>
              </React.Fragment>
            )
          })
          : ''
        }
      </List>
    );
  }
}

export default withStyles(styles)(AnnotationList);