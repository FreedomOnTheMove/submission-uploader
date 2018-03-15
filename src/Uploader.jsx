import React, {Component} from 'react';
import Dropzone from 'react-dropzone'
import GithubCorner from 'react-github-corner';

import logo from './img/fotm.png';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';

class Uploader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dropzoneDisabled: false,
            uploadProgress: 0
        };
    }

    onDrop = (files) => {
        this.setState({
            dropzoneDisabled: true
        });

        let uploader = this;
        let fd = new FormData();
        fd.append("file", files[0]);

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:1865/api/import', true);

        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                let percentComplete = (e.loaded / e.total) * 100;

                uploader.setState({
                    uploadProgress: Math.round(percentComplete)
                });
            }
        };
        xhr.onload = function () {
            if (this.status === 200) {
                let resp = JSON.parse(this.response);

                console.log(resp);
            }
        };
        xhr.send(fd);
    };

    render() {
        return (
            <div className="container">
                <header className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                    <img className="icon" src={logo} alt="Newspaper icon"/>
                    <h1 className="d-inline-block align-middle display-4">Freedom on the Move<br/>Submission Uploader
                    </h1>
                </header>
                <div className="row">
                    <div className="col">
                        <p className="lead text-center font-weight-normal">
                            This utility provides the ability to import the advertisements <br/>contained within Freedom
                            on the Move Submission Bundles.<br/><br/>
                            Once uploaded, the new ads are available for crowdsourcing &amp; search.
                        </p>
                    </div>
                </div>

                <div className="row">
                    <div className="mx-auto col-5">
                        <Dropzone onDrop={this.onDrop} className="dropzone" multiple={false} disabled={this.state.dropzoneDisabled} disabledClassName="dropzone-hidden">
                            <p className="text-center pt-4 pb-2">Drag a Freedom on the Move Submission Bundle here<br/>or
                                click to select one from a location.</p>
                        </Dropzone>

                        <div className="progress mt-4">
                            <div className="progress-bar" role="progressbar" style={{width: this.state.uploadProgress + '%'}} aria-valuenow={this.state.uploadProgress}
                                 aria-valuemin="0" aria-valuemax="100">{this.state.uploadProgress}
                            </div>
                        </div>

                        {!this.state.dropzoneDisabled ? <p className="text-center pt-3 pb-5">Need to create a submission bundle?<br/>Use our <a
                            href="https://fotm-bundler.ciser.cloud">online bundler.</a></p> : null}
                    </div>
                </div>

                <div className="mx-auto text-center pt-5 mb-5">
                    <small className="font-weight-light">Brought to life at <a
                        href="https://ciser.cornell.edu" className="ciser-link">CISER</a>.<br/>Made possible by generous
                        funding from
                        the<br/><a href="https://www.neh.gov/" className="neh-link">National Endowment for the
                            Humanities</a>.
                    </small>
                </div>

                <GithubCorner href="https://github.com/FreedomOnTheMove" bannerColor="#5b2d89"
                              octoColor="#fff"/>
            </div>
        );
    }
}

export default Uploader;
