import React, { Component } from "react";
import Firebase from 'firebase';

export default class MyClaims extends Component {

    state = {
        claims: []
    }

    constructor(props) {
        super(props);
        //this.state.user = this.props.user;
        this.getClaims = this.getClaims.bind(this);
    }

    componentDidMount() {
        this.getClaims();
    }

    getClaims = () => {
        //console.log("state" + JSON.stringify(this.state));
        let ref = Firebase.database().ref('claims').orderByChild('creator').equalTo(Firebase.auth().currentUser.uid/*this.state.user.uid*/);
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
                <h2 className="text-center">My Claims</h2>
                <table className="table table-responsive table-bordered table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Created</th>
                        <th scope="col">Title</th>
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
/*<tr>
    <td>10-02-2019</td>
    <td>Plane trip to London</td>
    <td>Not Accepted</td>
    <td><a href='#'>View</a></td>
</tr>*/
