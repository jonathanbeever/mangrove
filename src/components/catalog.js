import React, { Component } from 'react';

class SearchBar extends Component {
  render() {
    return(
      <form id="searchForm">
        <input name="searchJob" type="text" placeholder="Search Jobs.." />
        <button type="submit"><i class="fa fa-search"></i></button>
      </form>
    );
  }
}

class FilterRadios extends Component {
  render() {
    return(
      <div id="radioButtons">
        <input type="radio" value="completed" id="radio-complete" name="filterJob" checked="checked" />
        <label for="radio-complete">Complete</label>
        <input type="radio" value="inProgress" id="radio-progress" name="filterJob" />
        <label for="radio-progress">In Progress</label>
      </div>
    );
  }
}

class FilterIndex extends Component {
  render() {
    return(
      <div id="filterIndex">
        <label for="index"><b>Filter by index</b></label>
        <select name="index">
          <option value="ndsi">NDSI</option>
          <option value="aci">ACI</option>
          <option value="adi">ADI</option>
          <option value="rms">RMS</option>
        </select>
      </div>
    );
  }
}

class ResultName extends Component {
  render(){
    const result = this.props.result;
    return(
      <tr>
        <th>
          <label for={result}><b>{result}</b></label>
        </th>
        <th></th>
        <th>
          <input type="radio" name={result} value={result} id={result} />
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
  constructor(props) {
    super(props);
    this.state = {
      filterName: '',
      filterIndex: ''
    };
  }

  render() {
    const rows = [];
    let lastName = null;

    this.props.results.forEach((result) => {
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
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

class FilterJobs extends Component {
  render() {
    return(
      <div className="search-container">
        <SearchBar />
        <FilterRadios />
        <FilterIndex />
      </div>
    );
  }
}

class WorkingDirectory extends Component {
   render() {
     const wd = this.props.wd;
     return (
       <div>
         <button className="btn btn-lg btn-info">Change Working Directory</button>
         <p>{wd}</p>
       </div>
     );
   }
}

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
          <div className="col-4">
            <WorkingDirectory
              wd="C:/WorkingDirectory" />
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <div className="row d-block">
              <FilterJobs />
            </div>
            <div className="row d-block">
              <h4>Your Results</h4>
              <ResultTable
                results={this.props.results} />
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
