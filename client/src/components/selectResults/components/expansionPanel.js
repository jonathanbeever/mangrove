// import React from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import SpecsTable from '../specs/specsTable';

// const styles = theme => ({
//   root: {
//     width: '100%',
//   },
//   heading: {
//     fontSize: theme.typography.pxToRem(15),
//     fontWeight: theme.typography.fontWeightRegular,
//   },
// });

// function handleClick(props) {
//   console.log(props)
//   /**
//    * props.expanded = true if index is selected
//    * if clicked when false, 
//    *  change index function
//    *  set expanded state true
//    * if props.expanded = true, set state to true
//    * state.expanded = props.expanded
//    * onclick changeindex
//    * compdidupdate props.expanded
//    *  set state expanded
//    */
//   // console.log(e)
// }

// function SimpleExpansionPanel(props) {
//   const { classes } = props;
//   return (
//     <div className={classes.root}>
//     {/* onChange={props.handleChange({'target': props.index})} */}
//       <ExpansionPanel expanded={props.expanded}>
//         <ExpansionPanelSummary onClick={handleClick(props)} expandIcon={<ExpandMoreIcon />}>
//           <Typography className={classes.heading}>{props.index.toUpperCase() + ' Parameters'}</Typography>
//         </ExpansionPanelSummary>
//         <ExpansionPanelDetails>
//           <SpecsTable 
//             index={props.index}
//             specs={props.specs}
//             params={props.params}
//             updateSelectedSpecs={props.updateSelectedSpecs}
//             selectedSpecs={props.selectedSpecs}
//           />
//         </ExpansionPanelDetails>
//       </ExpansionPanel>
//     </div>
//   );
// }

// SimpleExpansionPanel.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(SimpleExpansionPanel);
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SpecsTable from '../specs/specsTable';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class Expansion extends React.Component {
  state = {
    expanded: this.props.expanded
  };

  handleClick = (event, value) => {
    if(!this.state.expanded)
      this.props.handleChange(this.props.index)
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps.expanded !== this.props.expanded)
      this.setState({ expanded: this.props.expanded })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={this.state.expanded}>
          <ExpansionPanelSummary onClick={this.handleClick} expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>{this.props.index.toUpperCase() + ' Parameters'}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SpecsTable 
              index={this.props.index}
              specs={this.props.specs}
              params={this.props.params}
              updateSelectedSpecs={this.props.updateSelectedSpecs}
              selectedSpecs={this.props.selectedSpecs}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

Expansion.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Expansion);