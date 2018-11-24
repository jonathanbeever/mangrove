import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AnalysisView from './analysis';

class ResultName extends Component {
  render(){
    return(
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Indices</TableCell>
          <TableCell>Params</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
    );
  }
}

class ResultRow extends Component {

  render() {
    const result = this.props.result;
    const resultName = result.name;
    const resultDate = result.date;
    const resultIndex = result.index;
    const resultParam = result.params;
    return(
      <TableRow>
        <TableCell><b>{resultName}</b></TableCell>
        <TableCell>{resultDate}</TableCell>
        <TableCell>{resultIndex}</TableCell>
        <TableCell>{resultParam}</TableCell>
        <TableCell>
          <Button color="primary" value={resultName} onClick={this.props.handleChosenResult}>Show Results</Button>
        </TableCell>
      </TableRow>
    );
  }
}

class ResultTable extends Component {

  render() {
    const filterName = this.props.filterName;
    const filterComplete = this.props.filterComplete;
    const filterIndex = this.props.filterIndex;

    const rows = [];
    let lastName = null;

    this.props.results.forEach((result) => {
      if(result.name.indexOf(filterName) === -1) return;
      if(filterIndex !== 'none' && result.index.indexOf(filterIndex) === -1) return;
      if(result.name !== lastName) {
        rows.push(
          <ResultRow
            result={result}
            key={result.name}
            handleChosenResult={this.props.handleChosenResult}/>
        );
      }

      lastName = result.name;
    });

    return(
      <div className="scrollTable">
        <Table>
          <ResultName />
          <TableBody>{rows}</TableBody>
        </Table>
      </div>
    );
  }
}

class FilterJobs extends Component {
  constructor(props){
    super(props);

    this.handleFilterNameChange = this.handleFilterNameChange.bind(this);
    this.handleFilterIndexChange = this.handleFilterIndexChange.bind(this);
  }

  handleFilterNameChange(e) {
    this.props.onFilterNameChange(e.target.value);
  }

  handleFilterIndexChange(e) {
    this.props.onFilterIndexChange(e.target.value);
  }

  render() {
    return(
      <div className="search-container">
        {/*<div id="radioButtons">
          <input type="radio" value="completed" id="radio-complete" name="filterJob" checked="checked" />
          <label for="radio-complete">Complete</label>
          <input type="radio" value="inProgress" id="radio-progress" name="filterJob" />
          <label for="radio-progress">In Progress</label>
        </div>*/}
        <FormControl>
          <Input placeholder="Search Jobs.." onChange={this.handleFilterNameChange} />
          <br />
          <Select
            native
            value={this.props.filterIndex}
            onChange={this.handleFilterIndexChange}
            inputProps={{
              name: 'index',
              id: 'age-native-simple',
            }}
          >
            <option value="none">No Index Filter</option>
            <option value="NDSI">NDSI</option>
            <option value="ACI">ACI</option>
            <option value="ADI">ADI</option>
            <option value="RMS">RMS</option>
            <option value="Bioacoustic">Bioacoustic</option>
          </Select>
        </FormControl>
      </div>
    );
  }
}

class FilterableResultsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterName: '',
      filterIndex: 'none',
      filterComplete: true
    };

    this.handleFilterNameChange = this.handleFilterNameChange.bind(this);
    this.handleFilterIndexChange = this.handleFilterIndexChange.bind(this);
  }

  handleFilterNameChange(filterName) {
    this.setState({
      filterName: filterName
    });
  }

  handleFilterIndexChange(filterIndex) {
    this.setState({
      filterIndex: filterIndex
    });
  }

  render() {
    return (
      <div>
        <FilterJobs
          filterName={this.state.filterName}
          filterIndex={this.state.filterIndex}
          filterComplete={this.state.filterComplete}
          onFilterNameChange={this.handleFilterNameChange}
          onFilterIndexChange={this.handleFilterIndexChange} />
        <h4>Your Results</h4>
        <ResultTable
          results={this.props.results}
          filterName={this.state.filterName}
          filterIndex={this.state.filterIndex}
          filterComplete={this.state.filterComplete}
          handleChosenResult={this.props.handleChosenResult} />
      </div>
    );
  }
}

// class WorkingDirectory extends Component {
//    render() {
//      const wd = this.props.wd;
//      return (
//        <div>
//          <button className="btn btn-lg btn-info">Change Working Directory</button>
//          <p>{wd}</p>
//        </div>
//      );
//    }
// }

class Catalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenResult: null
    };

    this.handleChosenResult = this.handleChosenResult.bind(this);
  }

  handleChosenResult(e) {
    let chosenName = e.currentTarget.value;
    let results = this.props.results;
    let found = results.find(obj => obj.name === chosenName)

    this.setState({
      chosenResult: found
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row" id="header">
          <div className="col-8">
            <h3>Your Results Catalog</h3>
          </div>
          {/*<div className="col-4">
            <WorkingDirectory
              wd="C:/WorkingDirectory" />
          </div>*/}
        </div>
        <div className="row">
          <div className="col-4">
            <div className="row d-block">
              <FilterableResultsTable
                results={this.props.results}
                handleChosenResult={this.handleChosenResult}/>
            </div>
          </div>
          <div className="col-8">
            <div className="analysis-container">
              <div className="row">
                <AnalysisView
                  chosenResult={this.state.chosenResult}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Catalog;
