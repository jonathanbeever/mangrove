import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import Icon from '@material-ui/core/Icon';

class SearchJobs extends Component {
  constructor() {
    super();

    this.state = {
    };
  }

  render() {
    return (
      <div>
        <TextField
          id="jobSearchBar"
          label="Search site names or tags"
          onChange={this.props.handleSearch}
          value={this.props.searchValue}
        />
        <Button onClick={this.props.submitSearch}>
          Search
        </Button>
      </div>
    );
  }
}

export default SearchJobs;