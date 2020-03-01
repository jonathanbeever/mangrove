import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import { Toolbar } from '@material-ui/core';
const image = require('./logo.1.svg')

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#fafafa',
  },
  title: {
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    marginTop: 0
  },
  background: {
    backgroundColor: "#031603",
    color: "#fdc907",
    textShadow: "1px 1px 2px #757575"
  }
});

class NavBarTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.background}>
          <Toolbar>
            <div className="col-3">
              <h2  position="relative" className={classes.title}><span style={{float: "left"}}><a style={{ color:"#fdc907", textDecoration:'none' }} href="http://jonathan.beever.org/" target="_blank" rel="noopener noreferrer"><img style={{filter: 'invert(1)', marginRight: 5+'px', marginBottom: 5+'px'}} src={image} alt="Mangrove Logo"/></a></span></h2>
            </div>
            <div className="col-8" style={{paddingRight: 15+'%'}}>
              <Tabs value={value}
                onChange={this.handleChange}
                TabIndicatorProps={{style: {backgroundColor: "#fdc907"}}}
                centered>
                <Tab value={0}
                  label="Create Jobs"
                  to="/newJobs"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}
                  activeStyle={{ color: '#fdc907', textDecoration: 'none' }}
                  component={NavLink} />
                <Tab value={1}
                  label="Results Catalog"
                  to="/catalog"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}
                  activeStyle={{ color: '#fdc907', textDecoration: 'none' }}
                  component={NavLink} />
                <Tab value={2}
                  label="Job Queue"
                  to="/jobQueue"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}
                  activeStyle={{ color: '#fdc907', textDecoration: 'none' }}
                  component={NavLink} />
                <Tab value={3}
                  label="Log Out"
                  to="/index.html"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}
                  activeStyle={{ color: '#fdc907', textDecoration: 'none' }}
                  component={NavLink} />
              </Tabs>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBarTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBarTabs);
