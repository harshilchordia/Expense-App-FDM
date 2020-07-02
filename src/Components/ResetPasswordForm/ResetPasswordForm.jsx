import React, { Component, useState } from "react";
import Firebase from 'firebase';

export default class ResetPasswordForm extends Component {
    state = {
        error: null
    }

    constructor(props) {
        super(props);
        this.resetPassword = this.resetPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e)
    {
        e.preventDefault();
        this.resetPassword(this.email.value);
    }

    resetPassword(email)
    {
        Firebase.auth().sendPasswordResetEmail(this.email.value) 
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
        var errorMessage = this.state.error == null ? "" : <div class="alert alert-danger" role="alert">{this.state.error}</div>
        return (
            <form class="form-signin" onSubmit={this.onSubmit}>
                <h4 class="mb-3 font-weight-normal">Reset Password</h4>
                {errorMessage}
                <label htmlFor="inputEmail" class="sr-only">Email address</label>
                <input type="email" id="inputEmail" class="form-control mb-1" placeholder="Email address" ref={(c) => this.email = c} required autoFocus/>
                <button class="btn btn-lg btn-primary btn-block mb-0" type="submit">Reset Password</button>
            </form>
        );
    }
}