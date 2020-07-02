import React, { Component } from "react";
import Firebase from 'firebase';

export default class EmployeeClaims extends Component {

    state = {
        claims: []
    }

    constructor(props) {
        super(props);
        this.getClaims = this.getClaims.bind(this);
    }

    componentDidMount() {
        this.getClaims();
    }

    getClaims = () => {
        //console.log("state" + JSON.stringify(this.state));
        let ref = Firebase.database().ref('claims').orderByChild('creator').equalTo(this.props.match.params.employeeID);
        ref.on('value', snapshot => {
            var claims = [];
            let value = snapshot.val();
            console.log("claims: " + JSON.stringify(value));
            for(var claim in value)
            {
                value[claim].id = claim;
                claims.push(value[claim]);
                console.log("claim " + value[claim].creator + "@" + value[claim].created);
            }
            this.setState({
                claims: claims
            });
        });
        console.log('Claim Data Recieved');
    }


    render() {
        this.state.claims.sort(function(claim1, claim2){return claim2.created - claim1.created});
        var claims = this.state.claims.map(claim => {
            return (<tr key={claim.created}>
                <td>{new Date(claim.created * 1000).toUTCString().slice(0, -4) }</td>
                <td>{claim.description}</td><td>{claim.status}</td>
                <td><a href={'/viewclaim/' + claim.id} target="_blank">View</a></td>
                </tr>);
        });

        return (
            <div>
                <h2>Claim History: { this.props.match.params.name }</h2>
                <table class="table table-responsive table-bordered table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Created</th>
                        <th scope="col">Title</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
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
