import React, { Component, useState } from "react";
import Firebase from 'firebase';

import './sign-in.css';


export default class SignInForm extends Component {
    state = {
        error: null
    }
    constructor(props) {
        super(props);
        this.signin = this.signin.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e)
    {
        e.preventDefault();
        this.signin(this.email.value, this.password.value);
    }

    signin(username, password)
    {
        Firebase.auth().signInWithEmailAndPassword(username, password)
        .then(() =>
            this.setState({
                error: null
            })
        )
        .catch(error =>
            this.setState({
                error: "Error " + error.code + ": " + error.message
            })
        );
    }

    render() {
        var errorMessage = this.state.error == null ? "" : <div class="alert alert-danger" role="alert">{this.state.error}</div>
        return (
            <form className="form-signin" onSubmit={this.onSubmit}>
                <h4 className="mb-3 font-weight-normal">Sign In</h4>
                {errorMessage}
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" className="form-control mb-1" placeholder="Email address" ref={(c) => this.email = c} required autoFocus/>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" ref={(c) => this.password = c} required/>
                <div className="checkbox mb-3">
                    <label>
                        <input type="checkbox" value="remember-me"/> Remember me
                    </label>
                </div>
                <button className="btn btn-lg btn-primary btn-block mb-0" type="submit">Sign in</button>
            </form>
        );
    }

}