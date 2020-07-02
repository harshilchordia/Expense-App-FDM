import React, { Component, useState } from "react";
import Firebase from 'firebase';
import './register.css';

class RegisterForm extends Component {

    state = {
        error: null
    }

    constructor(props) {
        super(props);
        this.register = this.register.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.writeUserData = this.writeUserData.bind(this);
    }

    onSubmit(e)
    {
        e.preventDefault();
        console.log(this.email.value + ":" + this.password.value + ":" + this.passwordConfirm.value);
        if(this.password.value == this.passwordConfirm.value)
        {
            this.setState({
                error: null
            });
            //console.log("hey2");
            this.register(this.email.value, this.password.value);
        }
        else
        {
            this.setState({
                error: "Passwords don't match!"
            });
        }
    }

    register(email, password)
    {
        Firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCred => {
            this.setState({
                error: null
            });
            //console.log(userCred.user);
            //console.log(userCred.user.$.W); //UID
            this.writeUserData(userCred.user.uid, "fullName", this.fullName.value);
            this.writeUserData(userCred.user.uid, "department", this.department.value);
            this.writeUserData(userCred.user.uid, "photoURL", "https://firebasestorage.googleapis.com/v0/b/expenseapp-d6863.appspot.com/o/profile.jpg?alt=media&token=cde09cd7-e44f-4b35-b085-27f42571d5b7");
            //this.props.setIsRegistering(false);
        })
        .catch(error => {
            this.setState({
                error: "Error " + error.code + ": " + error.message
            });
            console.log(error)
        });
        //console.log("hey3");
    }
    
    writeUserData(uid, property, value) {
        Firebase.database().ref('users/' + uid + '/' + property)
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
            console.log(error)
        });
        console.log('SET user:' + uid + " prop " + property + "=" + value);
    }

    render() {
        var errorMessage = this.state.error == null ? "" : <div class="alert alert-danger" role="alert">{this.state.error}</div>;
        return (
            <form class="form-signin" onSubmit={this.onSubmit}>
                <h4 class="mb-3 font-weight-normal">Register</h4>
                {errorMessage}
                <label for="inputName" class="sr-only">Name</label>
                <input type="text" id="inputName" class="form-control mb-2" placeholder="Full Name" ref={(c) => this.fullName = c} required autoFocus/>
                <label for="inputEmail" class="sr-only">Email address</label>
                <input type="email" id="inputEmail" class="form-control mb-2" placeholder="Email address" ref={(c) => this.email = c} required/>
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" class="form-control mb-1" placeholder="Password" ref={(c) => this.password = c} required/>
                <input type="password" id="inputPasswordConfirm" class="form-control" placeholder="Confirm Password" ref={(c) => this.passwordConfirm = c} required/>
                <label for="inputDepartment" class="sr-only">Department</label>
                <input type="text" id="inputDepartment" class="form-control mb-2" placeholder="Department" ref={(c) => this.department = c}/>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
            </form>
        );
    }

}

export default RegisterForm;
