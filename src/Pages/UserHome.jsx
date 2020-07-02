import React, { Component, useState } from "react";
import Firebase from 'firebase';


import MyAccount from './MyAccount';
import MyClaims from './MyClaims';
import NewClaim from './NewClaim';
import ReviewClaims from './ReviewClaims';
import Search from './Search';
import ManageAccounts from './ManageAccounts';

export default class UserHome extends Component {

    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.getIsManager = this.getIsManager.bind(this);
        this.getIsExpenseTeam = this.getIsExpenseTeam.bind(this);
        this.changePage = this.changePage.bind(this);

        this.state = {
            pages: {
                HOME: null,
                MYACCOUNT: <MyAccount/>,
                MYCLAIMS: <MyClaims/>,
                NEWCLAIM: <NewClaim/>,
                REVIEWCLAIMS: <ReviewClaims/>,
                MANAGEACCOUNTS: <ManageAccounts/>,
                SEARCH: <Search/>
            },
            page: null,
            uid: Firebase.auth().currentUser.uid,
            isManager: false,
            isExpenseTeam: false,
            isAdmin: false
        };
    }

    componentDidMount() {
        this.getIsManager();
        this.getIsExpenseTeam();
        this.getIsAdmin();
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
        console.log('DATA RETRIEVED');
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
        console.log('DATA RETRIEVED');
    }

    getIsAdmin() {
        let ref = Firebase.database().ref('users/' + this.state.uid);
        ref.on('value', snapshot => {
            const value = snapshot.val();
            if(value.isAdmin != null){
                this.setState({
                    isAdmin: value.isAdmin
                });
            }
            console.log(value);
        });
        console.log('DATA RETRIEVED');
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

    changePage(e)
    {
        e.preventDefault();
        switch(e.target.id)
        {
            case "home":
                this.setState({
                    page: this.state.pages.HOME
                });
                break;
            case "myAccount":
                this.setState({
                    page: this.state.pages.MYACCOUNT
                });
                break;
            case "myClaims":
                this.setState({
                    page: this.state.pages.MYCLAIMS
                });
                break;
            case "newClaim":
                this.setState({
                    page: this.state.pages.NEWCLAIM
                });
                break;
            case "reviewClaims":
                this.setState({
                    page: this.state.pages.REVIEWCLAIMS
                });
                break;
            case "manageAccounts":
                this.setState({
                    page: this.state.pages.MANAGEACCOUNTS
                });
                break;
            case "search":
                this.setState({
                    page: this.state.pages.SEARCH
                });
                break;
            default:
                this.setState({
                    page: this.state.pages.HOME
                });
                break;
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
                    <a className="navbar-brand" href="#">Expenses</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                        {/*<li className={"nav-item" + (this.state.page === this.state.pages.HOME ? " active" : "")}>
                            <a id="home" className="nav-link" href="#" onClick={this.changePage}>Home</a>
                        </li>*/}
                        <li className={"nav-item" + (this.state.page === this.state.pages.MYACCOUNT ? " active" : "")}>
                            <a id="myAccount" className="nav-link" href="#" onClick={this.changePage}>My Account</a>
                        </li>
                        <li className={"nav-item" + (this.state.page === this.state.pages.MYCLAIMS ||
                            this.state.page === this.state.pages.HOME ? " active" : "")}>
                            <a id="myClaims" className="nav-link" href="#" onClick={this.changePage}>My Claims</a>
                        </li>
                        <li className={"nav-item" + (this.state.page === this.state.pages.NEWCLAIM ? " active" : "")}>
                            <a id="newClaim" className="nav-link" href="#" onClick={this.changePage}>New Claim</a>
                        </li>
                        {!this.state.isManager && !this.state.isExpenseTeam ? null : <li className={"nav-item" + (this.state.page === this.state.pages.REVIEWCLAIMS ? " active" : "")}>
                            <a id="reviewClaims" className="nav-link" href="#" onClick={this.changePage}>Review Claims</a>
                        </li>}
                        {!this.state.isAdmin ? null : <li className={"nav-item" + (this.state.page === this.state.pages.MANAGEACCOUNTS ? " active" : "")}>
                            <a id="manageAccounts" className="nav-link" href="#" onClick={this.changePage}>Manage Accounts</a>
                        </li>}
                        {!this.state.isManager && !this.state.isExpenseTeam ? null : <li className={"nav-item" + (this.state.page === this.state.pages.SEARCH ? " active" : "")}>
                            <a id="search" className="nav-link" href="#" onClick={this.changePage}>Search</a>
                        </li>}
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={this.logOut}>Log Out</a>
                        </li>
                    </ul>
                    </div>
                </nav>
                <div className="container mb-2 vh-99" >
                    <div className="subpage">
                        {this.state.page == this.state.pages.HOME ? this.state.pages.MYCLAIMS : this.state.page}
                    </div>
                </div>
            </div>
        );
    }
}
//style={{height: "100vh", maxWidth: "100vw"}} // max-vw-100
//style={{paddingTop: "100px"}}