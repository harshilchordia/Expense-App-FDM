import React, { Component } from "react";
import Firebase from 'firebase';
import UploadToFirebase from '../Components/UploadToFirebase'

export default class MyAccount extends Component {

    state =
    {
        fullName: null,
        department: null,
        uid: null,
        email: null,
        photoURL: null,
        phoneNumber: null
    }

    constructor(props) {
        super(props);
        this.getUserData = this.getUserData.bind(this);
        this.writeUserData = this.writeUserData.bind(this);
        this.updateDetails = this.updateDetails.bind(this);
        this.onUploadComplete = this.onUploadComplete.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.logOut = this.logOut.bind(this);

        this.state.uid = Firebase.auth().currentUser.uid;//props.user.uid;
        this.state.email = Firebase.auth().currentUser.email;//props.user.email;

        //console.log("props.user.uid: " + props.user.uid);
        //console.log("state.uid: " + this.state.uid);
    }

    componentDidMount() {
        this.getUserData();
    }

    getUserData = () => {
        let ref = Firebase.database().ref('users/' + this.state.uid);
        ref.on('value', snapshot => {
            const state = snapshot.val();
            if(state != null){
                this.setState({
                    fullName: state.fullName,
                    department: state.department,
                    photoURL: state.photoURL,
                    phoneNumber: state.phoneNumber
                });
            }
            console.log(state);
        });
        console.log('DATA RETRIEVED');
    }

    writeUserData(property, value) {
        Firebase.database().ref('users/' + this.state.uid + '/' + property)
        .set(value)
        .then(() =>
        {
            this.setState({
                error: null
            });
        })
        .catch(error => {
            this.setState({
                error: "Incorrect " + property + " format."
            });
            this.getUserData();
            console.log(error)
        });
        console.log('SET user:' + this.state.uid + " prop " + property + "=" + value);
    }
    
    logOut(e)
    {
        e.preventDefault();
        Firebase.auth().signOut()
        .then(function() {
            // Sign-out successful.
        })
        .catch(function(error) {
            // An error happened
        });
    }

    updateDetails(e)
    {
        e.preventDefault();
        console.log(this.state.phoneNumber + "<>" + this.phoneNumber.value);
        if(this.state.phoneNumber != this.phoneNumber.value)
        {
            this.writeUserData('phoneNumber', this.phoneNumber.value);
        }
    }

    onUploadComplete(filename, url) {
        this.writeUserData('photoURL', url);
    }

    resetPassword()
    {
        Firebase.auth().sendPasswordResetEmail(this.state.email) 
        .then(
          () => alert('A password reset link has been sent to your email address'), 
          (rejectionReason) => alert(rejectionReason))
        .catch(error => {
            console.log(error);
            this.setState({
                error: error
            });
        }); 
    }

    render() {
        var errorMessage = this.state.error == null ? "" : <div className="alert alert-danger" role="alert">{this.state.error}</div>;
        return (
            <form>
                <h2 className="mb-3 font-weight-normal text-center">My Account</h2>
                {errorMessage}
                <img className="img-fluid img-responsive mb-1 d-block mx-auto rounded-circle border" src={this.state.photoURL} alt="Profile Picture" style={{height: "200px", width: "200px"}}></img>
                <UploadToFirebase text="Upload profile picture" path={'/user/' + this.state.uid + '/profilePic'} onUploadComplete={this.onUploadComplete} />
                <label>Name: </label>
                <input type="text" className="form-control mb-1" placeholder="Full Name" readOnly defaultValue={this.state.fullName}/>
                <label>Email address:</label>
                <input type="email" className="form-control mb-1" placeholder="Email address" readOnly defaultValue={this.state.email}/>
                <label>Department:</label>
                <input type="text" className="form-control mb-1" placeholder="Department" readOnly defaultValue={this.state.department}/>
                <label>Phone Number:</label>
                <input type="tel" className="form-control mb-1" placeholder="Phone Number" defaultValue={this.state.phoneNumber} ref={(c) => this.phoneNumber = c}/>
                <button className="btn btn-lg btn-primary btn-block mb-1" type="submit" onClick={this.updateDetails}>Update Details</button>
                <button className="btn btn-lg btn-warning btn-block mb-1" type="submit" onClick={this.resetPassword}>Change Password</button>
                <button className="btn btn-lg btn-danger btn-block mb-0" type="submit" onClick={this.logOut}>Log Out</button>
            </form>
        )
    }
}