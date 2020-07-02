import React, { Component } from "react";
import Firebase from 'firebase';
import * as $ from 'jquery';

export default class ManageAccounts extends Component {

    state = {
        uid: Firebase.auth().currentUser.uid,
        employeeList: []
    }

    constructor(props) {
        super(props);
        this.fetchEmployeeData = this.fetchEmployeeData.bind(this);
        this.setUserProperty = this.setUserProperty.bind(this);
        this.setIsManager = this.setIsManager.bind(this);
        this.setIsExpenseTeam = this.setIsExpenseTeam.bind(this);
        this.setIsAdmin = this.setIsAdmin.bind(this);
    }

    componentDidMount() {
        this.fetchEmployeeData();
        $(document).ready(function () {
            $("#myInput").on("keyup", function () {
                var value = $(this).val().toLowerCase();
                $("#myTable tr").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        });
    }

    fetchEmployeeData() {
        let ref = Firebase.database().ref('users').orderByChild('department');
        ref.on('value', snapshot => {
            let value = snapshot.val();
            var data = [];
            console.log("fetchEmployeeData value " + JSON.stringify(value));
            for (var employee in value) {
                value[employee].id = employee;
                data.push(value[employee]);
            }
            this.setState({
                employeeList: data
            });
        });
    }

    setIsManager(userUid, value) {
        this.setUserProperty(userUid, 'isManager', value);
    }

    setIsExpenseTeam(userUid, value) {
        this.setUserProperty(userUid, 'isExpenseTeam', value);
    }

    setIsAdmin(userUid, value) {
        this.setUserProperty(userUid, 'isAdmin', value);
    }

    setUserProperty(userUid, prop, value) {
        Firebase.database().ref('users/' + userUid + '/' + prop)
        .set(value)
        .then(() =>
        {
            this.setState({
                error: null
            });
        })
        .catch(error => {
            this.setState({
                error: error
            });
            console.log(error);
        });
        console.log('SET user:' + userUid + " prop " + prop + "=" + value);
    }

    render() {
        //console.log("RENDERING... " + JSON.stringify(this.state.employeeList));
        var tableData = this.state.employeeList.map((value) => {
            if (value.id === this.state.uid)
                return null;
            return (
                <tr key={ value.id }>
                    <td><a href={'/viewprofile/' + value.id} target="_blank">{ value.fullName }</a></td>
                    <td>{ value.isManager === true ? "True" : "False" }</td>
                    <td>{ value.isExpenseTeam === true ? "True" : "False" }</td>
                    <td>{ value.isAdmin === true ? "True" : "False" }</td>
                    <td>
                      <div class={"dropdown"}>
                        <a href="#" id={"dropdown_add_" + value.id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">&#10133;</a>
                        <div class="dropdown-menu" aria-labelledby={"dropdown_add_" + value.id}>
                            <a class="dropdown-item" href="#" onClick={() => this.setIsManager(value.id, true)}>Make Manager</a>
                            <a class="dropdown-item" href="#" onClick={() => this.setIsExpenseTeam(value.id, true)}>Make Expense Team</a>
                            <a class="dropdown-item" href="#" onClick={() => this.setIsAdmin(value.id, true)}>Make Admin</a>
                        </div>
                      </div>
                      <div class={"dropdown"}>
                        <a href="#" id={"dropdown_remove_" + value.id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">&#10134;</a>
                        <div class="dropdown-menu" aria-labelledby={"dropdown_remove_" + value.id}>
                            <a class="dropdown-item" href="#" onClick={() => this.setIsManager(value.id, false)}>Remove Manager</a>
                            <a class="dropdown-item" href="#" onClick={() => this.setIsExpenseTeam(value.id, false)}>Remove Expense Team</a>
                            <a class="dropdown-item" href="#" onClick={() => this.setIsAdmin(value.id, false)}>Remove Admin</a>
                        </div>
                      </div>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <input class="form-control mb-2" id="myInput" type="text" placeholder="Search.."/>
                <table class="table table-responsive table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>
                                Employee Name
                            </th>
                            <th>
                                Manager
                            </th>
                            <th>
                                ExpenseTeam
                            </th>
                            <th>
                                Admin
                            </th>
                            <th>
                                Change
                            </th>
                        </tr>
                    </thead>
                    <tbody id="myTable">
                        {tableData}
                    </tbody>
                </table>
            </div>
        );
    }

}

/*

this.removeAccount = this.removeAccount.bind(this);

<th>
    Remove
</th>
<td>
    <div class={"dropdown"}>
        <a href="#" id={"dropdown_delete_" + value.id} data-toggle="dropdown" aria-haspopup="true"
            aria-expanded="false">&#10006;</a>
        <div class="dropdown-menu" aria-labelledby={"dropdown_delete_" + value.id}>
            <a class="dropdown-item" href="#" onClick={()=> this.removeAccount(value.id)}>Confirm</a>
        </div>
    </div>
</td>
removeAccount(userUid) {
    Firebase.database().ref('users/' + userUid)
        .set(null)
        .then(() => {
            this.setState({
                error: null
            });
        })
        .catch(error => {
            this.setState({
                error: error
            });
            console.log(error);
        });
    Firebase.auth().getUser(userUid).then(function (userRecord) {
            console.log('Successfully fetched user data:', userRecord.toJSON());
            userRecord.delete().then(function () {
                console.log('Successfully deleted user:', userUid);
            }).catch(function (error) {
                console.log('Error deleting user:', error);
            });

        })
        .catch(function (error) {
            console.log('Error fetching user data:', error);
        });
    console.log('DELETE user:' + userUid);
}

*/