import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import RadioButtons from './radioButtons';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class ChooseIndex extends React.Component {
  state = {

  };

  handleChange = event => {
  };

  componentDidMount = () => {
    this.renderInfo()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.index !== this.props.index)
      this.renderInfo()
  }

  renderInfo() {
    switch(this.props.index) {
      case 'aci': {
        var html = (
        <div>
          <h3>Acoustic Complexity Index</h3>
          <p>
          Acoustic Complexity Index ACI from Pieretti, et al. 2011. The ACI is based on the "observation
  that many biotic sounds, such as bird songs, are characterized by an intrinsic variability of intensities, while some types of human generated noise (such as car passing or airplane transit) present
  very constant intensity values" Pieretti, et al. 2011..
          </p>
        </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      case 'ndsi': {
        html = (
          <div>
            <h3>Normalized Difference Soundscape Index</h3>
            <p>
            Normalized Difference Soundscape Index NDSI from REAL and Kasten, et al. 2012. The NDSI
seeks to "estimate the level of anthropogenic disturbance on the soundscape by computing the ratio
of human-generated anthrophony to biological biophony acoustic components found in field
collected sound samples" Kasten, et al. 2012.
            </p>
          </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      case 'aei': {
        html = (
          <div>
            <h3>Acoustic Evenness Index</h3>
            <p>
            Acoustic Evenness Index from Villanueva-Rivera et al. 2011 band evenness using the Gini index.
The AEI is calculated by dividing the spectrogram into bins default 10 and taking the proportion
of the signals in each bin above a threshold default -50 dBFS. The AEI is the result of the Gini
index applied to these bins.
            </p>
          </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      case 'adi': {
        html = (
          <div>
            <h3>Acoustic Diversity Index</h3>
            <p>
            Acoustic Diversity Index from Villanueva-Rivera et al. 2011. The ADI is calculated by dividing
the spectrogram into bins default 10 and taking the proportion of the signals in each bin above a
threshold default -50 dBFS. The ADI is the result of the Shannon index applied to these bins.
            </p>
          </div>
        )
        this.setState({ indexInfo: html }) 
        break;
      }
      case 'bi': {
        html = (
          <div>
            <h3>Bioacoustic Index</h3>
            <p>
            Bioacoustic Index from Boelman, et al. 2007. Inspired on Matlab code courtesy of NT Boelman.
Several parts where changed, in particular log math, so this won’t be directly comparable to the
original code in the paper.
The Bioacoustic Index is calculated as the "area under each curve included all frequency bands
associated with the dB value that was greater than the minimum dB value for each curve. The area
values are thus a function of both the sound level and the number of frequency bands used by the
avifauna" Boelman, et al. 2007.
            </p>
          </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      case 'rms': {
        html = (
          <div>
            <h3>Root Mean Squared</h3>
            <p>
            Bioacoustic Index from Boelman, et al. 2007. Inspired on Matlab code courtesy of NT Boelman.
Several parts where changed, in particular log math, so this won’t be directly comparable to the
original code in the paper.
The Bioacoustic Index is calculated as the "area under each curve included all frequency bands
associated with the dB value that was greater than the minimum dB value for each curve. The area
values are thus a function of both the sound level and the number of frequency bands used by the
avifauna" Boelman, et al. 2007.
            </p>
          </div>
        )
        this.setState({ indexInfo: html })
        break;
      }
      default:
        break;
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className="row">
          <div className="col-4">
            <RadioButtons changeIndex={this.props.changeIndex} />          
          </div>
          <div className="col-8">
            {this.state.indexInfo}
          </div>
        </div>
      </div>
    );
  }
}

ChooseIndex.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseIndex);