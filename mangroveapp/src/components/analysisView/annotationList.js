import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { ListSubheader, Collapse } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'

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
    }
  }

  // Modify state to toggle annotation list item opened/closed
  handleClick = (index, e) => {
    if (this.state.opened === index) this.setState({ opened: null });
    else this.setState({ opened: index });
  }

  render () {
    const { annotations, graph } = this.props;

    let annotationsFiltered;
    if (annotations !== undefined) annotationsFiltered = annotations.filter(annotation => annotation.annotationGraph === graph);
    else annotationsFiltered = [];

    return (
      <List
        component="div"
        subheader={
          <ListSubheader component="div">
            Annotations
          </ListSubheader>
        }
      >
        {
          (annotationsFiltered !== undefined) 
          ? annotationsFiltered.map((annotation, index, arrayObj) => {
            return (
              <React.Fragment key={index}>
                <ListItem button onClick={(e) => this.handleClick(index, e)} key={index}>
                  <ListItemText primary={annotation.annotation} />
                  { this.state.opened === index ? <ExpandLess /> : <ExpandMore /> }
                </ListItem>
                <Collapse in={this.state.opened === index} timeout="auto" unmountOnExit key={10}>
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