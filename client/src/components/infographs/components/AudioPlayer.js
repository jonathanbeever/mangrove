import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ReactPlayer from 'react-player';

const styles = theme => ({
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    paddingLeft: theme.spacing.unit * 3,
    textAlign: 'center'
  }
});

class AudioPlayer extends Component {
  constructor() {
    super();

    this.state = {
      showAudio: false,
    };
  }

  componentDidMount = () => {
    let { files, urls } = this.props;
    this.setState({ files });
    this.setState({ urls });
    this.setState({ chosenFile: files[0] });
    this.setState({ chosenUrl: urls[0] })
  }

  // Handler for the file Select
  handleFileChange = event => {
    let { files, urls } = this.state;
    this.setState({ chosenFile: event.target.value });
    this.setState({ chosenUrl: urls[files.indexOf(event.target.value)] });
    this.setState({ [event.target.name]: event.target.value });
  }

  // Creates the items seen in the file menu
  fileMenuItems = (fileNames) => {
    const menuItems = fileNames.map(file => {
      return <MenuItem key={"names"+file} value={file}>{file}</MenuItem>
    });
    return menuItems;
  }

  displayAudio = () => {
    let finalName = this.state.chosenFile;
    let finalPath = this.state.chosenUrl;

    let track = {
      title: finalName,
      src: finalPath
    }

    this.setState({ track });
    this.setState({ showAudio: true });
  }

  render(){
    let { chosenFile, files, track, showAudio } = this.state;
    const { classes } = this.props;

    return(
      <div className="row">
        <div>
          <FormControl style={{ marginLeft:10+'px', marginBottom:10+'px' }}>
            <InputLabel shrink htmlFor="file-helper"><h4>File Name</h4></InputLabel>
            <Select
              value={chosenFile ? chosenFile : ''}
              onChange={this.handleFileChange}
              input={<Input name="file" id="file-helper" />}
              displayEmpty
              name="file"
              className={classes.selectEmpty}
            >
              {files ?
                this.fileMenuItems(files)
              :
                ''}
            </Select>
            <FormHelperText style={{ fontSize:12+'px' }}>Select file to listen to</FormHelperText>
          </FormControl>
        </div>
        <div>
          <Button
            style={{margin: 20}}
            onClick={this.displayAudio}
            >
            <h6>Play Audio</h6>
          </Button>
        </div>
        { showAudio ?
          <div width={900} height={600}>
            <h5>{track.title}</h5>
            <ReactPlayer ref={this.ref}
                         height='65px'
                         url={track.src}
                         controls />
          </div>
          :
          ''
        }
      </div>
    );
  }
}

export default withStyles(styles)(AudioPlayer);
