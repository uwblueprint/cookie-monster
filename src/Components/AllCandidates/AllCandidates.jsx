import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import { TableRow, TableHead, TableCell, TableBody } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CommitteeReview from "./CommitteeReview.jsx"

const GET = require("../../requests/get");

const Wrapper = styled.div`
  margin-top: 150px;
  padding: 0 136px;
  h1 {
    font-size: 24px;
    font-weight: normal;
  }
  .table {
    border-radius: 4px 4px 0px 0px;

    max-width: 864px;
    margin: 0 auto;
  }
  table.MuiTable-root {
    border: 1px solid #cccccc;
  }
  button {
    max-width: 200px;
    padding: 5px 5px;
    text-transform: uppercase;
    font-size: 15px;
  }
`;

export default class AllCandidates extends Component {
  constructor(props) {
    super(props); 
    this.routeChange = this.routeChange.bind(this);
    this.state = {
      reviews: []
    };
  }

  componentDidMount() {
    GET.getUserReviewsAPI(this.props.user).then(res => {
      this.setState({ reviews: res });
    });
  }

  routeChange() {
    let path = `/admin/committeereview`; 
    this.props.history.push(path);
  }

  render() {
    return (
      <Wrapper className="application-list">
        <Paper>
          <h1>All Candidates</h1>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "20%" }}>
                  Average Rank
                </TableCell>
                <TableCell style={{ width: "20%" }}>
                  Candidate Name
                </TableCell>
                <TableCell style={{ width: "20%" }} align="left">
                  Average Rating
                </TableCell>
                <TableCell style={{ width: "20%" }} align="left" onClick={this.routeChange}>
                  # of Reviews
                </TableCell>
                <TableCell style={{ width: "20%" }} align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.reviews
                ? this.state.reviews.map(application => (
                    <TableRow hover key={application._id}>
                      <TableCell component="th" scope="row">
                        {application["Organization Name"]}
                      </TableCell>
                      <TableCell align="left"></TableCell>
                      <TableCell align="left"></TableCell>
                      <TableCell align="left"></TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          target="_blank"
                          value="OpenApplication"
                          onClick={() => {
                            this.props.history.push(
                              "submissions/" + application._id
                            );
                          }}
                        >
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : "ERROR LOADING APPLICATIONS FROM DATABASE"}
            </TableBody>
          </Table>
        </Paper>
      </Wrapper>
    );
  }
}
