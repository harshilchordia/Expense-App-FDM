import React, { Component } from "react";
import Firebase from 'firebase';

export default class ViewProfile extends Component {
    state = {
        uid: Firebase.auth().currentUser.uid,
    }

    constructor(props) {
        super(props);
        if(this.props.match != null)
            this.state.profID = this.props.match.params.userID;

        this.getUserData = this.getUserData.bind(this);
    }

    componentDidMount() {
        this.getUserData(this.state.profID);
    }

    getUserData = (uid) => {
        let ref = Firebase.database().ref('users/' + uid);
        ref.on('value', snapshot => {
            const value = snapshot.val();
            if(value != null){
                this.setState({
                    fullName: value.fullName,
                    department: value.department,
                    photoURL: value.photoURL,
                    isManager: value.isManager,
                    isExpenseTeam: value.isExpenseTeam
                });
            }
            console.log('DATA RETRIEVED');
            console.log(value);
        });
    }

    render() {
        return (
            <div>
                <img class="img-fluid img-responsive mb-1 d-block mx-auto rounded-circle border" src={this.state.photoURL} alt="Profile Picture" style={{height: "200px", width: "200px"}}></img><hr/>
                {!this.state.isManager ? null : <div><label>Manager</label><hr/></div>}
                {!this.state.isExpenseTeam ? null : <div><label>Expense Team Member</label><hr/></div>}
                <label>Name: {this.state.fullName}</label><hr/>
                <label>Department: {this.state.department}</label><hr/>
            </div>
        );
    }
}