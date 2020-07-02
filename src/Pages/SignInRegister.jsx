import React, { Component } from "react";
import { useState } from 'react';
import SignInForm from '../Components/SignInForm/SignInForm';
import RegisterForm from '../Components/RegisterForm/RegisterForm';
import ResetPasswordForm from '../Components/ResetPasswordForm/ResetPasswordForm';

export default class SigninRegister extends Component {
    state =
    {
        isRegistering: false,
        isResetingPassword: false
    }

    constructor(props) {
        super(props);
        this.onRegisterClick = this.onRegisterClick.bind(this);
        this.onSignInClick = this.onSignInClick.bind(this);
        this.onResetPasswordClick = this.onResetPasswordClick.bind(this);
    }

    onRegisterClick(e)
    {
        e.preventDefault();
        this.setState({
            isRegistering: true,
            isResetingPassword: false
        });
    }
    onSignInClick(e)
    {
        e.preventDefault();
        this.setState({
            isRegistering: false,
            isResetingPassword: false
        });
    }
    onResetPasswordClick(e)
    {
        e.preventDefault();
        this.setState({
            isRegistering: false,
            isResetingPassword: true
        });
    }

    render() {
        var form = this.state.isResetingPassword ? <ResetPasswordForm/> : this.state.isRegistering ? <RegisterForm /> : <SignInForm />;
        var registerLink = (!this.state.isRegistering ? <button type="button" className="btn btn-link underline" onClick={this.onRegisterClick}>Don't have an account? Register here.</button>
                                                      : <button type="button" className="btn btn-link underline" onClick={this.onSignInClick}>Already have an account? Sign in here.</button>);
        var forgotPasswordLink = (!this.state.isResetingPassword ? <button type="button" className="btn btn-link underline" onClick={this.onResetPasswordClick}>Forgot your password? Click here.</button>
                                                                 : <button type="button" className="btn btn-link underline" onClick={this.onSignInClick}>Go back</button>)

        return (
            <div className="bg-light">

              <div className= "navbartop">
                  <p></p>
              </div>

              <div className="navbar">
                  <img src={require("../Images/fdm.png")}/>
              </div>

              <div className="text-center">

                <div className="m-1">
                <br/>
                  {form}
                </div>
                {!this.state.isResetingPassword ? registerLink : null}
                <br/>
                {forgotPasswordLink}
              </div>
              <br/>
              <div class = "footer">

                <div class="footerElement"><center> © FDM Group 2020</center></div>
              </div>


            </div>
        )
    }
}
