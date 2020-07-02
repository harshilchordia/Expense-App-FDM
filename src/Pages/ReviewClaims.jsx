import React, { Component } from "react";
import Firebase from 'firebase';

export default class MyClaims extends Component {
    state = {
        department: null,
        claims: [],
        uid: Firebase.auth().currentUser.uid
    }

    constructor(props) {
        super(props);
        this.getDepartment = this.getDepartment.bind(this);
        this.getClaimsWaitingVerification = this.getClaimsWaitingVerification.bind(this);
        this.getClaimsWaitingApproval = this.getClaimsWaitingApproval.bind(this);
    }

    componentDidMount() {
        this.getDepartment();
        console.log(this.state);
    }

    // chooses what claims to get based on role and department
    getDepartment() {
        var employees = {};
        let ref = Firebase.database().ref('users');
        ref.on('value', snapshot => {
            let value = snapshot.val();
            var data = [];
            for (var employee in value) {
                employees[employee] = value[employee].fullName;
            }
            this.setState({
                employees: employees
            });
        });

        let ref2 = Firebase.database().ref('users/' + this.state.uid);
        ref2.on('value', snapshot => {
            const value = snapshot.val();
            this.state.department = value.department;
            if(value.isExpenseTeam && value.isManager !== true){
                this.getClaimsWaitingApproval();
            } else {
                this.getClaimsWaitingVerification(employees);
            }
            console.log(value);
        });
    }

    // gets list of claims waiting verification
    // and displays only ones in this manager's department
    getClaimsWaitingVerification(employees) {
        let ref = Firebase.database().ref('claims').orderByChild('status').equalTo("Waiting Verification");
        ref.on('value', snapshot => {
            var claims = [];
            let value = snapshot.val();
            for(var claim in value)
            {
                if(value[claim].creator === this.state.uid || value[claim].department != this.state.department)
                    continue;
                value[claim].id = claim;
                const index = claims.push(value[claim]) - 1;
                //console.log("claim: " + JSON.stringify(value[claim]));
                /*let ref2 = Firebase.database().ref('users/' + value[claim].creator); //WE NEED TO EXPECT THIS MIGHT HAPPEN BEFORE SETTING ALL CLAIMS
                ref2.once('value', snapshot2 => {
                    const value2 = snapshot2.val();
                    //console.log("index: " + index + ", claimlen: " + this.state.claims.length + ", " + JSON.stringify(this.state.claims[index]) + " <= " + JSON.stringify(value2));
                    if(index < this.state.claims.length)
                        //this.state.claims[index].creatorName = value2.fullName;
                        this.state.claims[index].creatorName = employees[claim];
                    this.setState({});
                });*/
            }
            this.setState({
                claims: claims
            });
        });
        console.log('in getClaimsWaitingVerification()');
        console.log(this.state);
    }

    // gets all claims waiting approval
    getClaimsWaitingApproval() {
        let ref = Firebase.database().ref('claims').orderByChild('status').equalTo("Waiting Approval");
        ref.on('value', snapshot => {
            var claims = [];
            let value = snapshot.val();
            for(var claim in value)
            {
                if(value[claim].creator === this.state.uid)
                    continue;
                value[claim].id = claim;
                const index = claims.push(value[claim]) - 1;
                //console.log("claim: " + JSON.stringify(value[claim]));
                let ref2 = Firebase.database().ref('users/' + value[claim].creator); //WE NEED TO EXPECT THIS MIGHT HAPPEN BEFORE SETTING ALL CLAIMS
                ref2.once('value', snapshot2 => {
                    const value2 = snapshot2.val();
                    //console.log("index: " + index + ", claimlen: " + this.state.claims.length + ", " + JSON.stringify(this.state.claims[index]) + " <= " + JSON.stringify(value2));
                    if(index < this.state.claims.length)
                        this.state.claims[index].creatorName = value2.fullName;
                    this.setState({});
                });
            }
            this.setState({
                claims: claims
            });
            console.log('Claim Data Recieved');
        });
    }

    render() {
        this.state.claims.sort(function(claim1, claim2){return claim2.created - claim1.created});
        var claims = this.state.claims.map(claim => {
            return (<tr key={claim.created}>
                <td>{new Date(claim.created * 1000).toUTCString().slice(0, -4) }</td>
                {/*<td><a href={'/viewprofile/' + claim.creator} target="_blank">{claim.creatorName == null ? claim.creator : claim.creatorName}</a></td>*/}
                <td><a href={'/viewprofile/' + claim.creator} target="_blank">{this.state.employees[claim.creator]}</a></td>
                <td>{claim.description}</td>
                <td>{claim.amount}</td>
                <td>{claim.status}</td>
                <td><a href={'/viewclaim/' + claim.id} target="_blank">View</a></td>
                </tr>);
        });

        return (
            <div>
                <h2 className="text-center">Review Claims</h2>
                <table className="table table-responsive table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Created</th>
                            <th scope="col">Creator</th>
                            <th scope="col">Description</th>
                            <th scope="col">Amount (£)</th>
                            <th scope="col">Status</th>
                            <th scope="col">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims}

                    </tbody>
                </table>
            </div>
        );
    }
}
