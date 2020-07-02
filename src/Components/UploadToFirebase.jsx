import React, { Component } from "react";
import Firebase from 'firebase';
import ProgressBar from 'react-bootstrap/ProgressBar'

export default class UploadToFirebase extends Component {
    state = {
        fileProgress: 0,
        //path: '', //  '/user/' + Firebase.auth().currentUser.uid + "/evidence/" + uuid()
        error: null
    }

    constructor(props) {
        super(props);
        this.uploadEvidence = this.uploadEvidence.bind(this);
        this.onUploadComplete = this.onUploadComplete.bind(this);
    }

    onUploadComplete(filename, url)
    {
        this.props.onUploadComplete(filename, url);
    }

    uploadEvidence(e)
    {
        e.preventDefault();
        /*if(!file.type.startsWith("image/"))*/
        var file = e.target.files[0];
        console.log(file);
        var storageRef = Firebase.storage().ref(this.props.path);
        var uploadTask = storageRef.put(file);
        uploadTask.on('state_changed', snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            this.setState({
                fileProgress: progress
            });
            switch (snapshot.state) {
              case Firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case Firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
        }, error => {
            this.setState({
                error: error.code + ": " + error.message
            });
            console.log("Error uploading file: " + error.message);
        }, () => {
            console.log('Uploaded a piece of evidence!');
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                console.log('File available at', downloadURL);
                this.onUploadComplete(file.name, downloadURL);
            }, this);
            this.setState({
                error: null,
                fileProgress: 100
            });
        });
    }

    render() {
        console.log(JSON.stringify(Firebase.auth()));
        console.log(this.props.resetProgressBar);
        return(
            <div className="position-relative">
                <input type="file" className="custom-file-input form-control mb-1" id="customFile" onChange={this.uploadEvidence} required/>
                <label className="custom-file-label form-control mb-1 " htmlFor="customFile">{this.props.text}</label>
                {this.state.error == null ? "" : <div className="alert alert-danger" role="alert">{this.state.error}</div>}
                <ProgressBar striped variant="success" now={this.props.resetProgressBar ? 0 : this.state.fileProgress} />
            </div>
        );
    }
}
