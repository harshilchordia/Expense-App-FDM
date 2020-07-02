
import React, { Component } from "react";
import Firebase from 'firebase';
import {v4 as uuid} from 'uuid';
import UploadToFirebase from '../Components/UploadToFirebase'

export default class NewClaim extends Component {

    state = {
        files: [],
        fileProgress: 0,
        uploadPath: '/user/' + Firebase.auth().currentUser.uid + '/evidence/' + uuid(),
        uid: Firebase.auth().currentUser.uid,
        department: "",
        resetProgressBar: false
    }

    constructor(props) {
        super(props);
        this.submitClaim = this.submitClaim.bind(this);
        this.onUploadComplete = this.onUploadComplete.bind(this);
    }

    componentDidMount() {
        let ref = Firebase.database().ref('users/' + this.state.uid);
        ref.on('value', snapshot => {
            const user = snapshot.val();
            this.setState({
                department: user.department
            });
        });
    }

    submitClaim(e) {
        e.preventDefault();

        var claimKey = Firebase.database().ref('claims').push().key;
        var updates = {
            "creator": this.state.uid,
            "department": this.state.department,
            "created": Math.round((new Date()).getTime() / 1000),
            "status": "Waiting Verification",
            "amount": this.amount.value,
            "description": this.description.value,
            "evidence": this.state.files,
            "verifiedBy": null, //"no one"
            "completedBy": null, //"no one"
            "rejectionReason": "",
            "dateCompleted": 0
        };

        Firebase.database().ref('claims/' + claimKey)
        .update(updates)
        .then(() =>{
            this.setState({
                error: null,
                info: "Submitted claim!"
            });
        })
        .catch(error => {
            console.log(error);
            this.setState({
                error: error.errorCode + ": " + error.errorMessage
            });
        });

        //alert(claimKey);
        this.setState({files: []});
        document.getElementById("submit-claim-form").reset();
        this.state.resetProgressBar = true;
    }

    onUploadComplete(filename, url)
    {
        this.state.files.push({name: filename, url: url});
        this.state.uploadPath = '/user/' + Firebase.auth().currentUser.uid + '/evidence/' + uuid();
        this.state.resetProgressBar = false;
        this.setState({});
    }


    render() {
        var files = this.state.files.map(file => {
            return <div><a href={file.url} target="_blank">{file.name}</a> &#10003;</div>
        });

        var defaultValues = {
            amount: "50.00",
            description: ""
        }
        return(
            <div>
                <h2 className="text-center">New Claim</h2>
                {this.state.info == null ? "" : <div className="alert alert-success" role="success">{this.state.info}</div>}
                {this.state.error == null ? "" : <div className="alert alert-danger" role="alert">{this.state.error}</div>}
                <form onSubmit={this.submitClaim} id="submit-claim-form">
                    <label htmlFor="inputAmount" className="sr-only">Amount</label>
                    <div className="input-group">
                        <div className="input-group-prepend d-block">
                            <span className="input-group-text">£</span>
                        </div>
                        <input type="number" defaultValue={defaultValues.amount} min="0.01" step="0.01" className="form-control currency mb-2" style={{WebkitAppearance: "none", MozAppearance: "textfield"}} ref={(c) => this.amount = c} required autoFocus/>
                    </div>
                    <label htmlFor="inputDescription" className="sr-only">Description</label>
                    <textarea id="inputDescription" className="form-control mb-2" rows="8" placeholder="Description" ref={(c) => this.description = c} required/>
                    <UploadToFirebase text="Upload evidence" path={this.state.uploadPath} onUploadComplete={this.onUploadComplete} resetProgressBar={this.state.resetProgressBar}/>
                    {files.length <= 0 ? null : files}
                    <button className="btn btn-lg btn-primary btn-block mt-2" type="submit">Submit</button>
                </form>
            </div>
        )
    }
}
