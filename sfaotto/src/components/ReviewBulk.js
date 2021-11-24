import React from 'react';
import { ModalDownload, LoadingDots } from '../components'
import moment from 'moment'
import axios from '../actions/config';
import { NEWAPI_V2, NEWAPI_V2_3 } from '../actions/constants'

var dateNow = new Date()
var dateNow2 = moment(dateNow, 'DDMMYYYY')
dateNow2 = dateNow2.format('DDMMYYYY')

class BulkCreate extends React.Component {
  state = {
    confirmIsOpen: false,
    TemplateBulk: "load",
    type: '',
    textSuccess: '',
    textError: '',
    upload: '',
    uploadStatus: 'Upload',
    error_url: ''
  }

  componentDidMount(){
    axios.get(NEWAPI_V2 + `/todolist/download-template`)
    .then(data => {
      let result = data.data;
      if(result.meta.status !== false){
        if(result.data.template){
          let fullURL = `${process.env.REACT_APP_IMAGE_URL}${result.data.template}`
          this.setState({TemplateBulk: fullURL})
        }
      }
    })
    .catch(e => {
      // this.setState({TemplateBulk: "", confirmIsOpen: true, type: 'error', textError: `Get bulk template for To-do list fail`, uploadStatus: 'Upload'})
    })
  }

  uploadBulk = () => {
    if (this.refs.file.files) {
      this.setState({uploadStatus: 'Uploading File...'})

      const data = new FormData();
      data.append('file', this.state.upload[0]);
      axios.post(NEWAPI_V2_3 + `/todolist/bulk`, data)
      .then(data => {
        let result = data.data;
        if(result.meta.status === false){
          this.setState({confirmIsOpen: true, type: 'error', textError: result.meta.message + ' Silahkan ubah dan upload ulang file.', uploadStatus: 'Upload', error_url: result.data.error_file})
        }else{
          this.setState({confirmIsOpen: true, type: 'success', textSuccess: `Bulk upload To-do list sukses`, uploadStatus: 'Upload'})
        }
      })
      .catch(e => {
        this.setState({confirmIsOpen: true, type: 'error', textSuccess: `Bulk upload To-do list gagal`, uploadStatus: 'Upload'})
      })
    }
  }

  downloadError = () => {
    const url = this.state.error_url
    if (url !== "") {
      fetch(url)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          let url2 = window.URL.createObjectURL(blob)
          let a = document.createElement('a');
          a.href = url2;
          a.download = 'error_file_to_do_list_' + dateNow2 + '.csv'
          a.click();
      });
    }

  }

  render() {
    const { browserHistory } = this.props
    const { confirmIsOpen, TemplateBulk, type, textSuccess, textError, upload, uploadStatus } = this.state

    return (
      <React.Fragment>
        <ModalDownload
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({confirmIsOpen: false})}
          confirmSuccess={() => browserHistory.push(`/reviews`)}
          textSuccess={textSuccess}
          textError={textError}
          download={() => this.downloadError()}
        />

        <div className="card mb-5">
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-12">
                <h6>Add To-do List Bulk</h6>
                <div className="form-group mt-4 mb-2">
                  <input type='file' ref='file' onChange={e => this.setState({upload: e.target.files})} />
                </div>
              </div>
            </div>
            <a href="#" className={`btn btn-block ${upload === '' ? 'btn-danger disabled' : 'btn-danger'} ${uploadStatus === 'Uploading File...' ? 'btn-danger disabled' : 'btn-danger'}`} onClick={() =>{
              this.uploadBulk()
            }}>{uploadStatus}</a>
          </div>

          {(TemplateBulk.length > 0 && TemplateBulk !== "load") &&
            <div className="card-footer card-footer-button text-center">
              <a href={TemplateBulk}>Download file template</a>
            </div>
          }
          {TemplateBulk.length === "load" &&
            <div className="card-footer card-footer-button text-center d-flex align-items-center justify-content-center">
              <LoadingDots color="black" />
            </div>
          }
          
        </div>
      </React.Fragment>
    );
  }
}

export default BulkCreate