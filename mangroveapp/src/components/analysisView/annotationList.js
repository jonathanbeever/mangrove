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
    this.props.rows.forEach(row => {
      openInit.push(false);
    });

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
          this.props.rows.map((row, index, arrayObj) => {
            return (
              <React.Fragment key={index}>
                <ListItem button onClick={(e) => this.handleClick(index, e)} key={index}>
                  <ListItemText primary={row.annotation} />
                  { this.state.open[index] ? <ExpandLess /> : <ExpandMore /> }
                </ListItem>
                <Collapse in={this.state.open[index]} timeout="auto" unmountOnExit key={10}>
                  <List component="div" disablePadding>
                    <ListItem button key={row.dataPoint.X}>
                      <ListItemText primary={row.dataPoint.X} />
                    </ListItem>
                    <ListItem button key={row.dataPoint.Y1}>
                      <ListItemText primary={row.dataPoint.Y1} />
                    </ListItem>
                    <ListItem button key={row.dataPoint.Y2}>
                      <ListItemText primary={row.dataPoint.Y2} />
                    </ListItem>
                  </List>
                </Collapse>
              </React.Fragment>
            )
          })
        }
      </List>
    );
  }
}

export default withStyles(styles)(AnnotationList);