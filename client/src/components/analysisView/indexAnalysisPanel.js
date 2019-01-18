import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

class IndexAnalysisPanel extends Component {

  render()
  {
    return(
      <div>
        <Table>
          <TableBody>{this.props.specRows}</TableBody>
        </Table>
      </div>
    )
  }
}

export default IndexAnalysisPanel;
