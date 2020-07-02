import React, { Component, useState } from 'react';
import Firebase from 'firebase';
import config from './config';

import UserHome from './Pages/UserHome';
import SignInRegister from './Pages/SignInRegister';
import MyAccount from './Pages/MyAccount';
import ViewClaim from './Pages/ViewClaim';
import ViewProfile from './Pages/ViewProfile';
import EmployeeClaims from './Pages/EmployeeClaims';

import './App.css';
import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js'
import * as $ from 'jquery';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default class App extends Component {
  state = {
    isLoading: true,
    error: null,
    loggedIn: false,
    user: {}
  };

  constructor(props){
    super(props);
    console.log("HELLO");
    this.setLoggedIn = this.setLoggedIn.bind(this);
    Firebase.initializeApp(config);

    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        /*var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;*/
        this.setState({
          user: {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            uid: user.uid
          },
          loggedIn: true
        });
        console.log("logged in: " + this.state.user.email);
        console.log("photourl: " + user.photoURL);
      } else {
        this.setState({
          loggedIn: false,
          user: {}
        });
      }
    });
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  setLoggedIn(loggedIn)
  {
    this.state.loggedIn = loggedIn;
  }

  render() {
    const { isLoading, error, loggedIn } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoading) {
      return <div>Loading...</div>;
    } else {
      //var page = loggedIn ? <MyAccount user={this.state.user}/> : <SignInRegister />; //loggedIn ? <UserHome /> : <SignInRegister />;
      var page = loggedIn ? <UserHome/> : <SignInRegister />;
      //var page = loggedIn ? <MyClaims/> : <SignInRegister />;
      return (
          <Router>

                <Route exact path="/">
                  { page }
                </Route>
                <Route path="/signin-register">
                  { page }
                </Route>
                <Route path="/account">
                  { loggedIn ? <MyAccount/> : <SignInRegister /> }
                </Route>
                <Route path="/viewclaim/:claimID" component={loggedIn ? ViewClaim : SignInRegister}/>
                <Route path="/viewprofile/:userID" component={loggedIn ? ViewProfile : SignInRegister}/>
                <Route path="/employeeclaims/:name/:employeeID" component={loggedIn ? EmployeeClaims : SignInRegister}/>
          </Router>
      );
    }
  }
}
