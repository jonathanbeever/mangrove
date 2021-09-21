import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    paddingLeft: theme.spacing(3),
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
    let { files, urls, filepaths, inputs } = this.props;
    this.setState({ files });
    this.setState({ urls });
    this.setState({ filepaths });
    this.setState({ inputs });
    this.setState({ chosenFile: files[0] });
    this.setState({ chosenUrl: urls[0] });
    this.setState({ chosenFilepath: filepaths[0] });
    this.setState({ chosenInput: inputs[0] });
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ files: nextProps.files });
    this.setState({ urls: nextProps.urls });
    this.setState({ filepaths: nextProps.filepaths });
    this.setState({ inputs: nextProps.inputs });
    this.setState({ chosenFile: nextProps.files[0] });
    this.setState({ chosenUrl: nextProps.urls[0] });
    this.setState({ chosenFilepath: nextProps.filepaths[0] });
    this.setState({ chosenInput: nextProps.inputs[0] });
  }

  // Handler for the file Select
  handleFileChange = event => {
    let { files, urls, filepaths, inputs } = this.state;
    this.setState({ chosenFile: event.target.value });
    this.setState({ chosenUrl: urls[files.indexOf(event.target.value)] });
    this.setState({ chosenFilepath: filepaths[files.indexOf(event.target.value)] });
    this.setState({ chosenInput: inputs[files.indexOf(event.target.value)] });
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
    let finalPath = this.state.chosenFilepath;
    let finalInput = this.state.chosenInput;

    let track = {
      title: finalName,
      src: finalPath,
      inputId: finalInput,
    }

    this.props.audioCallback(track);
  }

  render(){
    let { chosenFile, files } = this.state;
    const { classes } = this.props;

    return(
      <div style={{ paddingLeft: 15+'px', marginBottom:20+'px' }}className="row">
        <div>
          <FormControl style={{ marginLeft:10+'px' }}>
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
      </div>
    );
  }
}

export default withStyles(styles)(AudioPlayer);
