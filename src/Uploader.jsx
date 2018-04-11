import React, {Component} from 'react';
import Dropzone from 'react-dropzone'
import GithubCorner from 'react-github-corner';

import logo from './img/fotm.png';
import processing from './img/loading.gif';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import ImportErrors from "./components/ImportErrors";

class Uploader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileSelected: false,
            dropzoneDisabled: false,
            importResult: null,
            processing: false,
            progressbarDisabled: true,
            uploadProgress: 0
        };
    }

    startUpload = () => {
        this.setState({
            dropzoneDisabled: true,
            progressbarDisabled: false,
            fileSelected: false
        });

        let uploader = this;
        let fd = new FormData();
        fd.append("file", this.state.file);

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:1865/api/import', true);

        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                let percentComplete = Math.round((e.loaded / e.total) * 100);

                uploader.setState({
                    uploadProgress: percentComplete,
                    progressbarDisabled: percentComplete === 100,
                    processing: percentComplete === 100
                });
            }
        };

        xhr.onload = function () {
            console.debug(this);
            console.debug(this.status);
            console.debug(this.readyState);
            if (this.status === 200) {
                let resp = JSON.parse(this.response);
                console.log(resp);

                uploader.setState({
                    processing: false,
                    importResult: resp
                });
            }
        };

        xhr.onloadend = function (ev) {
            console.debug(xhr);
            console.debug(xhr.status);
            console.debug(xhr.readyState);
            if (xhr.status === 404) {
                console.debug(404);
                uploader.setState({
                    processing: false,
                    importResult: {
                        errors: [
                            "Failed to connect to server."
                        ]
                    }
                });
            }
        };

        xhr.send(fd);
    };

    onDrop = (files) => {
        this.setState({
            fileSelected: true,
            file: files[0]
        });

    };

    resetPage = () => {
        this.setState({
            fileSelected: false,
            dropzoneDisabled: false,
            importResult: null,
            processing: false,
            progressbarDisabled: true,
            uploadProgress: 0
        });
    };

    resultContainer = () => {
        if (this.state.importResult != null && this.state.importResult.errors.length === 0) {
            return (
                    <div className="text-center">
                        <h2>Archive successfully imported!</h2>
                        <div className="svg-box">
                            <svg className="circular green-stroke">
                                <circle className="path" cx="75" cy="75" r="50" fill="none" strokeWidth="5"
                                        strokeMiterlimit="10"/>
                            </svg>
                            <svg className="checkmark green-stroke">
                                <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-489.57,-205.679)">
                                    <path className="checkmark__check" fill="none"
                                          d="M616.306,283.025L634.087,300.805L673.361,261.53"/>
                                </g>
                            </svg>
                        </div>
                        <h4>{this.state.importResult.successfulImports} advertisements were imported.</h4>
                        <button className="btn" onClick={this.resetPage}>Upload More Advertisements</button>
                    </div>
            )
        } else if (this.state.importResult != null && this.state.importResult.errors.length > 0) {
            return (
                    <div className="text-center">
                        <h1>Unable to import archive</h1>
                        <div className="svg-box">
                            <svg className="circular red-stroke">
                                <circle className="path" cx="75" cy="75" r="50" fill="none" strokeWidth="5"
                                        strokeMiterlimit="10"/>
                            </svg>
                            <svg className="cross red-stroke">
                                <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-502.652,-204.518)">
                                    <path className="first-line" d="M634.087,300.805L673.361,261.53" fill="none"/>
                                </g>
                                <g transform="matrix(-1.28587e-16,-0.79961,0.79961,-1.28587e-16,-204.752,543.031)">
                                    <path className="second-line" d="M634.087,300.805L673.361,261.53"/>
                                </g>
                            </svg>
                        </div>
                        <h4>{this.state.importResult.failedImports} advertisements failed to import.</h4>
                        <ImportErrors errors={this.state.importResult.errors}/>
                        <button className="btn" onClick={this.resetPage}>Try Again</button>
                    </div>
            )
        }
    };

    render() {
        return (
                <div className="container">
                    <header className="px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                        <img className="icon" src={logo} alt="Newspaper icon"/>
                        <h1 className="d-inline-block align-middle display-4">Freedom on the Move<br/>Submission
                            Uploader
                        </h1>
                    </header>
                    {!this.state.dropzoneDisabled ? <div className="row">
                        <div className="col">
                            <p className="lead text-center font-weight-normal">
                                This utility provides the ability to import the advertisements <br/>contained within
                                Freedom
                                on the Move Submission Bundles.<br/><br/>
                                Once successfully imported, the new ads are available for crowdsourcing &amp; search.
                            </p>
                        </div>
                    </div> : null}

                    <div className="row">
                        <div className="mx-auto col-5">
                            <Dropzone onDrop={this.onDrop} className="dropzone" multiple={false}
                                      activeStyle={{background: "#936FB8"}}
                                      disabled={this.state.dropzoneDisabled} disabledClassName="dropzone-hidden">
                                <p className="text-center pt-4 pb-2">Drag a Freedom on the Move Submission Bundle
                                    here<br/>or
                                    click to select one from a location.</p>
                            </Dropzone>

                            {this.state.fileSelected &&
                                <div className="row vertical-align">
                                    <div className="col-8">
                                        <span>{this.state.file.name}</span>
                                    </div>
                                    <button className="btn col-2" onClick={this.startUpload}>Upload</button>
                                </div>
                            }

                            {this.state.processing ?
                                    <div className="text-center mt-3">
                                        <h2 className="mb-0 pb-0">Processing import.</h2>
                                        <img src={processing} alt="processing upload"/>
                                    </div> : null}

                            {!this.state.progressbarDisabled ? <div className="progress mt-4">
                                <div className="progress-bar" role="progressbar"
                                     style={{width: this.state.uploadProgress + '%'}}
                                     aria-valuenow={this.state.uploadProgress}
                                     aria-valuemin="0" aria-valuemax="100">{this.state.uploadProgress}
                                </div>
                            </div> : null}

                        </div>
                    </div>

                    {this.state.importResult !== null ? this.resultContainer() : null}

                    <div className="mx-auto text-center pt-5 mb-5">
                        <small className="font-weight-light">Brought to life at <a
                                href="https://ciser.cornell.edu" className="ciser-link">CISER</a>.<br/>Made possible by
                            generous
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
