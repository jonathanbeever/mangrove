import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './selectResults.css'

class SearchJobs extends Component {
  constructor() {
    super();

    this.state = {
    };
  }

  render() {
    return (
    <div className="row">
      <div id="jobSearchBar">
        <TextField
          label="Search site names or tags"
          onChange={this.props.handleSearch}
          value={this.props.searchValue}
        />
      </div>

        <Button onClick={this.props.submitSearch}>
          Search
        </Button>
        </div>
    );
  }
}

export default SearchJobs;