import React, { Component } from "react";
import Firebase from 'firebase';
import { Link } from "react-router-dom";
import * as $ from 'jquery';

export default class Search extends Component {


    constructor(props) {
        super(props);
        this.setTableContent = this.setTableContent.bind(this);
        this.changeSearchType = this.changeSearchType.bind(this);
        this.fetchEmployeeData = this.fetchEmployeeData.bind(this);
        this.fetchDepartmentData = this.fetchDepartmentData.bind(this);
        this.state = {
            uid: Firebase.auth().currentUser.uid,
            searchType: "Employee",
            tableHeadings: [],
            tableData: []
        }
    }

    componentDidMount() {
        $(document).ready(function(){
          $("#myInput").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#myTable tr").filter(function() {
              $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
          });
        });
        this.setTableContent(this.state.searchType);
    }


    componentDidUpdate() {
        //console.log("componentDidUpdate: " + JSON.stringify(this.state))
    }
    changeSearchType = (newSearchType) => {
        if (newSearchType != this.state.searchType) {
            this.setState({
                searchType: newSearchType,
                tableHeadings: [],
                tableData: []
            });
            this.setTableContent(newSearchType);
        }
        //console.log("changeSearchType " + JSON.stringify(this.state));
    }

    setTableContent(searchType) {
        if (searchType == "Employee") {
            this.fetchEmployeeData();
        } else {
            this.fetchDepartmentData();
        }
        console.log("setTableContent " + JSON.stringify(this.state));
    }

    fetchEmployeeData() {
        var headings = ["Name", "Department", "Claim History", "Report"];
        var data = [];
        let ref = Firebase.database().ref('users').orderByChild('department');
        ref.on('value', snapshot => {
            let value = snapshot.val();
            var data = [];
            console.log("fetchEmployeeData value " + JSON.stringify(value));
            for (var employee in value) {
                data.push({
                    id: employee,
                    name: value[employee].fullName,
                    department: value[employee].department,
                    uid: employee
                });
            }
            this.setState({
                tableHeadings: headings,
                tableData: data
            });
            console.log("showing employee uid:");
            console.log(this.state.tableData);
        });
    }

    fetchDepartmentData() {
        var headings = ["Department", "Report"];
        let ref = Firebase.database().ref('departments');
        ref.on('value', snapshot => {
            let value = snapshot.val();
            console.log("fetchDepartmentData value " + JSON.stringify(value));
            var data = [];
            for (let department in value) {
                data.push({
                    department: value[department]
                });
            }
            this.setState({
                tableHeadings: headings,
                tableData: data
            });
        });
    }

    render() {
        var tableHeadings = this.state.tableHeadings.map((value) => {
            return (
                <th key={value}>{ value }</th>
            );
        });

        return (
            <div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.searchType}</button>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" onClick={ () => this.changeSearchType("Employee") }>Employee</a>
                    <a className="dropdown-item" onClick={ () => this.changeSearchType("Department") }>Department</a>
                  </div>
                </div>
                <input className="form-control" id="myInput" type="text" placeholder="Search.."/>
            </div>
              <br/>
              <table className="table table-responsive table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    {tableHeadings}
                  </tr>
                </thead>
                <tbody id="myTable">
                {this.state.tableData.map((value) => {
                      return (
                          <tr key={this.state.searchType == "Employee" ? value.id : value.department}>
                            { this.state.searchType == "Employee" ? <td>{ value.name }</td> : null }
                            <td>{ value.department }</td>
                            { this.state.searchType == "Employee" ? <td><a href={'/employeeclaims/' + value.name + "/" + value.uid} target="_blank">View</a></td> : null }

                            <td><a href='#'>Report</a></td>
                          </tr>
                      );
                  })}
                </tbody>
              </table>
              </div>
        );
    }

}
