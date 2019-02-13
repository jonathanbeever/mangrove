import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import { Toolbar } from '@material-ui/core';

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
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 15
  },
  title: {
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
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
        <AppBar position="static">
          <Toolbar>
            <div className="col-2">
              <h2 className={classes.title}>Mangrove</h2>
            </div>
            <div className="col-8">
              <Tabs value={value}
                onChange={this.handleChange}
                centered>
                <Tab value={0}
                  label="Catalog"
                  to="/catalog"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}
                  activeStyle={{ color: 'white', textDecoration: 'none' }}
                  component={NavLink} />
                <Tab value={1}
                  label="Create Jobs"
                  to="/newJobs"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}
                  activeStyle={{ color: 'white', textDecoration: 'none' }}
                  component={NavLink} />
                <Tab value={2}
                  label="Job Queue"
                  to="/jobQueue"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}
                  activeStyle={{ color: 'white', textDecoration: 'none' }}
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
