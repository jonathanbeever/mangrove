import React, { Component } from 'react';

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

class FilterJobs extends Component {
  render() {
    return(
      <div class="search-container">
        <form id="searchForm">
          <input name="searchJob" type="text" placeholder="Search Jobs.." />
          <button type="submit"><i class="fa fa-search"></i></button>
        </form>
        <div id="radioButtons">
          <label class="radio-container">Completed
            <input name="searchType" type="radio" value="Completed" />
            <span class="checkmark"></span>
          </label>
          <label class="radio-container">In Progress
            <input name="searchType" type="radio" value="In Progress" />
            <span class="checkmark"></span>
          </label>
        </div>
        <div id="filterIndex">
          <label for="index"><b>Filter by index</b></label>
          <select name="index">
            <option value="ndsi">NDSI</option>
            <option value="aci">ACI</option>
            <option value="adi">ADI</option>
            <option value="rms">RMS</option>
          </select>
        </div>
      </div>
    );
  }
}

class ResultTable extends Component {
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
      <div class="table-wrapper">
        <table>
          <tbody>{rows}</tbody>
        </table>
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
        <td>{resultDate},</td>
        <td>{resultIndex},</td>
        <td>{resultParam}</td>
      </tr>
    );
  }
}

class Catalog extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h3>Your Results Catalog</h3>
          </div>
          <div className="col">
            <WorkingDirectory
              wd="C:/WorkingDirectory" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <FilterJobs />
            <h4>Your Results</h4>
            <ResultTable
              results={this.props.results} />
          </div>
          <div className="col">
            // ToDo: analysis component
          </div>
        </div>
      </div>
    );
  }
}

export default Catalog;
