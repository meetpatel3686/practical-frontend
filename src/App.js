import React, { Component } from "react";
import './App.css';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import Alert from '@material-ui/lab/Alert';
import { saveInformation, getInformation } from "./actions/informationActions";
import { connect } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import WarningIcon from '@material-ui/icons/Warning';

registerPlugin( FilePondPluginImagePreview, FilePondPluginFileValidateType)

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      files: [],
      pictures: [],
      filePondError: null,
      getInfoId:"",
      formError: null,
      showSuccess:false
  };
  }

  handleInputChange = e => {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmitForm = async e => {
    e.preventDefault();
    this.setState({showSuccess:false});
    if(this.state.pictures.length < 1 || this.state.files.length < 1){
      return this.setState({formError:"Please upload both the picture & file first!"});
    }
    await this.props.saveInformation({picture:this.state.pictures[0], file:this.state.files[0]})
    this.setState({files:[], pictures:[], showSuccess:true});
  }

  renderInformation = () => {
    if(this.props.isFetchingInformation){
      return (
        <div style={{height:"50vh"}}>
          <div className="container-fluid col-12 h-100 d-flex flex-column text-center justify-content-center align-items-center">
              <CircularProgress color="inherit" />
              <div className="mt-3">Fetching Information...</div>
          </div>
        </div>);
    }
    if(this.props.informationReceived){
      return (
        <div>
        <div className="row">
          <div className="col-12">
            <img alt="profile" height="100%" width="100%" src={this.props.informationReceived.picture}></img>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mt-3">
          <a href={this.props.informationReceived.file} download="File">
            {/* <button type="button" className="btn btn-info"> */}
              Click To Download File
            {/* </button>   */}
          </a>
          </div>
        </div>
      </div>
      );
    }
    if(this.props.fetchingInformationError){
      return (
        <div style={{height:"50vh"}}>
          <div className="container-fluid col-12 h-100 d-flex flex-column text-center justify-content-center align-items-center">
            <WarningIcon color="inherit" fontSize="large" />
            <div className="mt-3">{this.props.fetchingInformationError}</div>
          </div>
        </div>);
    }
  }

  onFetchInfo = async e => {
    e.preventDefault();
    await this.props.getInformation(this.state.getInfoId);
  }

  render(){
    return(
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="row">
              <div className="col-12 mt-3">
                <h2 className="text-center">Upload Information</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
              <form onSubmit={this.onSubmitForm}>
                <div className="form-group">
                <label htmlFor="file-input"><h4>Upload Picture</h4></label>
                  <FilePond
                    onaddfile={() => {this.setState({filePondError: null, formError:null, showSuccess:false})}}
                    acceptedFileTypes={['image/*']}
                    labelFileTypeNotAllowed="Invalid File Type"
                    allowMultiple={false}
                    files={this.state.pictures}
                    labelFileProcessing="Uploading..."
                    onupdatefiles={(fileItems) => {
                        this.setState({
                        pictures: fileItems.map(
                            (fileItem) => fileItem.file
                        )
                        });
                    }}
                    imagePreviewMaxHeight="180"
                    name="picture-input"
                    id="picture-input"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
                        {this.state.filePondError && <div className="mt-4" style={{width: '70vw'}}>
                            <Alert severity="error">{this.state.filePondError}</Alert>
                        </div>}
                </div>
                <div className="form-group">
                <label htmlFor="file-input"><h4>Upload File</h4></label>
                  <FilePond
                      onaddfile={() => {this.setState({filePondError: null, formError:null, showSuccess:false})}}
                      labelFileTypeNotAllowed="Invalid File Type"
                      allowMultiple={false}
                      files={this.state.files}
                      labelFileProcessing="Uploading..."
                      onupdatefiles={(fileItems) => {
                          this.setState({
                          files: fileItems.map(
                              (fileItem) => fileItem.file
                          )
                          });
                      }}
                      imagePreviewMaxHeight="200"
                      name="file-input"
                      id="file-input"
                      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    />
                </div>
                      {console.log("err : ", this.state.formError)}
                {this.state.formError && <Alert severity="error">{this.state.formError}</Alert>}
                <div className="text-right mt-2">
                  <button disabled={this.props.isSavingInformation} type="submit" className="btn btn-primary">
                    {this.props.isSavingInformation ? <>Saving...<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" /></> : <>Save</>}
                  </button>
                </div>
                    {this.state.showSuccess && this.props.savedInformationId!==null && <Alert className="mt-3" severity="success">Information successfully uploaded for Id: {this.props.savedInformationId}</Alert>}
              </form>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="row">
              <div className="col-12 mt-4">
              <form className="form-inline mx-auto" onSubmit={this.onFetchInfo}>
                <div className="mx-auto">
                    <input type="text" className="form-control" id="infoid-input" name="getInfoId" value={this.state.getInfoId} onChange={this.handleInputChange} placeholder="Enter information ID" />
                  <button type="submit" className="btn btn-primary mb-2 my-auto ml-3">Fetch</button>
                </div>
              </form>
              </div>
            </div>

            <div className="row">
              <div className="col-12 mt-5">
              {this.renderInformation()}
              </div>
            </div>
          </div>
        </div>
      </div>)
  }
}

const mapStateToProps = ({InformationReducer}) => {
  return{
    isSavingInformation:InformationReducer.isSavingInformation,
    savedInformationId: InformationReducer.savedInformationId,
    savingInformationError:InformationReducer.savingInformationError,
    isFetchingInformation:InformationReducer.isFetchingInformation,
    fetchingInformationError:InformationReducer.fetchingInformationError,
    informationReceived:InformationReducer.informationReceived
  }
}

export default connect(mapStateToProps, {saveInformation, getInformation})(App);
