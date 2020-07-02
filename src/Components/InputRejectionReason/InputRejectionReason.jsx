import React, { Component, useState } from "react";
import Firebase from 'firebase';
import * as $ from 'jquery';


export default class InputRejectionReason extends Component {
    state = {
        uid: Firebase.auth().currentUser.uid
    }

    constructor(props) {
        super(props);
        this.reason = React.createRef();
        this.rejectClaim = this.rejectClaim.bind(this);
    }

    rejectClaim(e) {
        e.preventDefault();

        Firebase.database().ref('claims/' + this.props.claimID + '/status')
        .set("Rejected")
        .then(() =>
        {
            console.log('SET claim ' + this.props.claimID + " rejected");
        })
        .catch(error => {
            console.log(error)
        });

        Firebase.database().ref('claims/' + this.props.claimID + '/completedBy')
        .set(this.state.uid)
        .then(() =>
        {
            console.log('SET claim ' + this.props.claimID + " completedBy");
        })
        .catch(error => {
            console.log(error)
        });

        Firebase.database().ref('claims/' + this.props.claimID + '/rejectionReason')
        .set(this.reason.value)
        .then(() =>
        {
            console.log('SET claim ' + this.props.claimID + " rejectionReason");
        })
        .catch(error => {
            console.log(error)
        });

        Firebase.database().ref('claims/' + this.props.claimID + '/dateCompleted')
        .set(Math.round((new Date()).getTime() / 1000))
        .then(() =>
        {
            console.log('SET claim ' + this.props.claimID + " dateCompleted");
        })
        .catch(error => {
            console.log(error)
        });

        $('#exampleModal').modal('hide');

    }

    render() {
        return (
            <div>
                <button type="button" class="btn btn-lg btn-danger btn-block mt-2" data-toggle="modal" data-target="#exampleModal">Reject</button>
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">Reason for rejection</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <form onSubmit={this.rejectClaim}>
                          <div class="form-group">
                            <label for="message-text" class="col-form-label">Reason:</label>
                            <textarea class="form-control" ref={(r) => this.reason = r} required></textarea>
                          </div>

                          <div class="modal-footer">
                            <button type="button" class="btn btn-lg btn-secondary btn-block mt-2" data-dismiss="modal">Cancel</button>
                            <button class="btn btn-lg btn-danger btn-block mt-2" type="submit">Reject</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        );
    }
}
