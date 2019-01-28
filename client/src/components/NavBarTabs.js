import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';

function TabContainer(props) {
  return (
    <Typography component="div" style={{}}>
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
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 15
  },
  fullHeight: {
    ...theme.mixins.toolbar,
  },
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
        <AppBar position="static">
          <Toolbar>
            <div className="col-2"><h2>SoundScape</h2></div>
            <div className="col-8">
              <Tabs value={value}
                    onChange={this.handleChange}
                    classes={{root: classes.fullHeight }}
                    centered>
                <Tab value={0}
                    label={<div><h5>Catalog</h5></div>}
                    classes={{root: classes.fullHeight }}
                    to="/catalog"
                    style={{color: 'white', textDecoration: 'none'}}
                    activeStyle={{color: 'white', textDecoration: 'none'}}
                    component={NavLink} />
                <Tab value={1}
                    label={<div><h5>Create Jobs</h5></div>}
                    classes={{root: classes.fullHeight }}
                    to="/newJobs"
                    style={{color: 'white', textDecoration: 'none'}}
                    activeStyle={{color: 'white', textDecoration: 'none'}}
                    component={NavLink} />
                <Tab value={2}
                    label={<div><h5>Settings</h5></div>}
                    classes={{root: classes.fullHeight }}
                    to="/settings"
                    style={{color: 'white', textDecoration: 'none'}}
                    activeStyle={{color: 'white', textDecoration: 'none'}}
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
