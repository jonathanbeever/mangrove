import React, { Component } from 'react';

class Catalog extends Component {

  constructor(props) {
    super(props);

    // Todo: add handlers here

    // Todo: add state elements here

  }

  render() {
    return (
      <div className="container-fluid">
          <div className="row">
            <div className="col">
              <h3>Your Results Catalog</h3>
            </div>
            <div className="col">
              <button className="btn btn-lg btn-info">Change Working Directory</button>
              <p>Current working directory here</p>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="row">
                <div className="col">
                  <div class="search-container">
                    <form action="">
                      <input name="searchJob" type="text" placeholder="Search Jobs.." />
                      <button type="submit"><i class="fa fa-search"></i></button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <label class="radio-container">Completed
                    <input name="searchType" type="radio" value="Completed" />
                    <span class="checkmark"></span>
                  </label>
                  <label class="radio-container">In Progress
                    <input name="searchType" type="radio" value="In Progress" />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-8">
              <div class="results-name-container">
                <div className="row">
                  <h5>Chosen Results name here</h5>
                  <div className="col">
                    <p>Chosen Results date/time here</p>
                  </div>
                  <div className="col">
                    <p>Chosen Results parameters here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default Catalog;
