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
      open: [],
    }
  }

  componentDidMount = () => {
    let openInit = [];
    // Initialize array with false open values
    if (this.props.annotations !== undefined)  {
      this.props.annotations.forEach(row => {
      openInit.push(false);
      });
    }

    this.setState({ open: openInit });
  }

  // Modify state to toggle annotation list item opened/closed
  handleClick = (index, e) => {
    const list = this.state.open.map((item, j) => {
      if (j===index) {
        return !item;
      } else {
        return item;
      }
    });

    this.setState({ open: list });
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
                  { this.state.open[index] ? <ExpandLess /> : <ExpandMore /> }
                </ListItem>
                <Collapse in={this.state.open[index]} timeout="auto" unmountOnExit key={10}>
                  <List component="div" disablePadding>
                    <ListItem button key={annotation.dataPoint.X}>
                      <ListItemText primary={annotation.dataPoint.X} />
                    </ListItem>
                    <ListItem button key={annotation.dataPoint.Y}>
                      <ListItemText primary={annotation.dataPoint.Y} />
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