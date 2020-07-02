import React, { Component } from "react";
import Firebase from 'firebase';
import InputRejectionReason from '../Components/InputRejectionReason/InputRejectionReason';

export default class ViewClaim extends Component {
    state = {
        uid: Firebase.auth().currentUser.uid,
        isManager: false,
        isExpenseTeam: false,
        claimID: null,
        claim: null
    }

    constructor(props) {
        super(props);
        this.getIsManager = this.getIsManager.bind(this);
        this.getIsExpenseTeam = this.getIsExpenseTeam.bind(this);
        this.getClaimData = this.getClaimData.bind(this);
        this.approveClaim = this.approveClaim.bind(this);
        this.verifyClaim = this.verifyClaim.bind(this);
        this.getUserName = this.getUserName.bind(this);
        console.log("props:" + JSON.stringify(this.props));
        if(this.props.match != null)
            this.state.claimID = this.props.match.params.claimID;
    }

    componentDidMount() {
        this.getClaimData();
        this.getIsManager();
        this.getIsExpenseTeam();
    }

    getIsManager() {
        let ref = Firebase.database().ref('users/' + this.state.uid);
        ref.on('value', snapshot => {
            const value = snapshot.val();
            if(value.isManager != null){
                this.setState({
                    isManager: value.isManager
                });
            }
            console.log(value);
        });
    }

    getIsExpenseTeam() {
        let ref = Firebase.database().ref('users/' + this.state.uid);
        ref.on('value', snapshot => {
            const value = snapshot.val();
            if(value.isExpenseTeam != null){
                this.setState({
                    isExpenseTeam: value.isExpenseTeam
                });
            }
            console.log(value);
        });
    }

    getClaimData() {
        if(this.state.claimID == null)
            return;
        let ref = Firebase.database().ref('claims/' + this.state.claimID);
        ref.on('value', snapshot => {
            const value = snapshot.val();
            console.log("got claim data " + this.state.claimID + ": " + JSON.stringify(value));
            if(value == null)
                return;
            this.setState({
                claim: value
            }, () =>
            {
                this.getUserName(value.creator, (name) => {
                    var claim = this.state.claim;
                    claim.creatorName = name;
                    this.setState({claim: claim});
                });
                if(value.verifiedBy != null)
                    this.getUserName(value.verifiedBy, (name) => {
                        var claim = this.state.claim;
                        claim.verifiedByName = name;
                        this.setState({claim: claim});
                    });
                if(value.completedBy != null)
                    this.getUserName(value.completedBy, (name) => {
                        var claim = this.state.claim;
                        claim.completedByName = name;
                        this.setState({claim: claim});
                    });
            }, [value]);

            console.log(JSON.stringify(value));
        });
    }

    verifyClaim(e) {
        e.preventDefault();

        Firebase.database().ref('claims/' + this.state.claimID + '/status')
        .set("Waiting Approval")
        .then(() =>
        {
            console.log('SET claim ' + this.state.claimID + " Waiting Approval");
        })
        .catch(error => {
            console.log(error)
        });
        Firebase.database().ref('claims/' + this.state.claimID + '/verifiedBy')
        .set(this.state.uid)
        .then(() =>
        {
            console.log('SET claim ' + this.state.claimID + " verifiedBy");
        })
        .catch(error => {
            console.log(error)
        });

    }

    approveClaim(e) {
        e.preventDefault();

        Firebase.database().ref('claims/' + this.state.claimID + '/status')
        .set("Approved")
        .then(() =>
        {
            console.log('SET claim ' + this.state.claimID + " approved");
        })
        .catch(error => {
            console.log(error)
        });
        Firebase.database().ref('claims/' + this.state.claimID + '/completedBy')
        .set(this.state.uid)
        .then(() =>
        {
            console.log('SET claim ' + this.state.claimID + " completedBy");
        })
        .catch(error => {
            console.log(error)
        });

        Firebase.database().ref('claims/' + this.state.claimID + '/dateCompleted')
        .set(Math.round((new Date()).getTime() / 1000))
        .then(() =>
        {
            console.log('SET claim ' + this.state.claimID + " dateCompleted");
        })
        .catch(error => {
            console.log(error)
        });
    }

    checkIfRecentlyApprovedOrRejected() {
        var dateCompleted = new Date(this.state.claim.dateCompleted * 1000);
        var dateNow = new Date();
        if((dateNow - dateCompleted) < 3000) {
            return true;
        } else {
            return false;
        }
    }

    getUserName(userUid, callback) {
        let ref = Firebase.database().ref('users/' + userUid);
        ref.once('value', snapshot => {
            const value = snapshot.val();
            callback(value.fullName);
        });
    }

    render() {
        if(this.state.claim == null)
            return <div></div>;

        var showCompletedBanner = this.checkIfRecentlyApprovedOrRejected();

        var evidence = this.state.claim.evidence == null ? null : this.state.claim.evidence.map(evidence => {
            return <a href={evidence.url} download={evidence.name} target="_blank">{evidence.name}</a>
        });

        return (

            <div>
                {this.state.claim == null ? null : (
                    <div>
                    { showCompletedBanner ? <div className={ this.state.claim.status == "Approved" ? "alert alert-success" : "alert alert-danger"} role="success">Claim { this.state.claim.status }</div> : null }
                    <h2>View Claim</h2>
                    <hr/>
                        <div>
                            <p>Created: {new Date(this.state.claim.created * 1000).toUTCString().slice(0, -4)}</p><hr/>
                            <p>Made By: <a href={'/viewprofile/' + this.state.claim.creator} target="_blank">{this.state.claim.creatorName == null ? this.state.claim.creator : this.state.claim.creatorName}</a></p><hr/>
                            <p>Department: {this.state.claim.department}</p><hr/>
                            <p>Amount: £{this.state.claim.amount}</p><hr/>
                            <p>Status: {this.state.claim.status}</p><hr/>
                            { this.state.claim.status == "Rejected" ? <div><p>Rejection Reason: {this.state.claim.rejectionReason}</p><hr/></div> : null }
                            <p>Verified By: {this.state.claim.verifiedBy == null ? "" : <a href={'/viewprofile/' + this.state.claim.verifiedBy} target="_blank">{this.state.claim.verifiedByName == null ? this.state.claim.verifiedBy : this.state.claim.verifiedByName}</a>}</p><hr/>
                            { this.state.claim.status == "Approved" || this.state.claim.status == "Rejected" ?
                            <div><p>{ this.state.claim.status } By: {this.state.claim.completedBy == null ? "" : <a href={'/viewprofile/' + this.state.claim.completedBy} target="_blank">{this.state.claim.completedByName == null ? this.state.claim.completedBy : this.state.claim.completedByName}</a>}</p><hr/></div> : null }
                            <p>Description: {this.state.claim.description}</p><hr/>
                            <p>Evidence: {evidence}</p>
                            {!this.state.isManager ||
                            this.state.claim.status == "Approved" ||
                            this.state.claim.status == "Waiting Approval" ||
                            this.state.claim.status == "Rejected" ||
                            this.state.claim.creator == this.state.uid ? null : <button className="btn btn-lg btn-warning btn-block mt-2" type="submit" onClick={this.verifyClaim}>Verify</button>
                            }
                            {this.state.isExpenseTeam &&
                            this.state.claim.status == "Waiting Approval" &&
                            this.state.claim.creator != this.state.uid ?
                                <div>
                                    <button className="btn btn-lg btn-success btn-block mt-2" type="submit" onClick={this.approveClaim}>Approve</button>
                                    <InputRejectionReason claimID = {this.state.claimID}/>
                                </div>
                                : null
                            }
                        </div>
                    </div>)}
            </div>

        );
    }
}
