import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class ResultName extends Component {
  render(){
    const result = this.props.result;
    return(
      <tr>
        <th colSpan="2">
          <b>{result}</b>
        </th>
      </tr>
    );
  }
}

class ResultRow extends Component {
  render() {
    const result = this.props.result;
    const resultDate = result.date;
    const resultIndex = result.index;
    const resultParam = result.params;
    return(
      <tr>
        <td>{resultDate} </td>
        <td>{resultIndex} </td>
        <td>{resultParam}</td>
      </tr>
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
          <ResultName
            result={result.name}
            key={result.name} />
        );
      }
      rows.push(
        <ResultRow
          result={result}
          key={result.name} />
      );
      lastName = result.name;
    });

    return(
      <div className="scroll">
        <Table>
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
        {/*<button type="submit"><i class="fa fa-search"></i></button>*/}
        {/*<div id="radioButtons">
          <input type="radio" value="completed" id="radio-complete" name="filterJob" checked="checked" />
          <label for="radio-complete">Complete</label>
          <input type="radio" value="inProgress" id="radio-progress" name="filterJob" />
          <label for="radio-progress">In Progress</label>
        </div>*/}
        <form>
          <input name="searchJob" type="text" placeholder="Search Jobs.." value={this.props.filterName} onChange={this.handleFilterNameChange} />
          <label for="index"><b>Filter by index</b></label>
          <select name="index" value={this.props.filterName} onChange={this.handleFilterIndexChange}>
            <option value="none">No Filter</option>
            <option value="NDSI">NDSI</option>
            <option value="ACI">ACI</option>
            <option value="ADI">ADI</option>
            <option value="RMS">RMS</option>
          </select>
        </form>
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
          filterComplete={this.state.filterComplete} />
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

class AnalysisView extends Component {
  render() {
    const chosenResult = this.props.chosenResult;

    return (
      <div>
        <h5>{chosenResult}</h5>
        <p>Analysis goes here!</p>
      </div>
    );
  }
}

class Catalog extends Component {

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
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
                results={this.props.results}/>
            </div>
          </div>
          <div className="col-8">
            <div className="analysis-container">
              <div className="row">
                <AnalysisView />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Catalog;
