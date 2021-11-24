import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { ModalConfirm } from '../../components'
import axios from '../../actions/config';

import bulkFormat from '../../format_bulk_upload_salesman.xlsx';
import { NEWAPI } from '../../actions/constants';

class BulkCreate extends React.Component {
  state = {
    confirmIsOpen: false,
    TemplateBulk: '',
    type: '',
    textSuccess: '',
    textError: '',
    upload: '',
    uploadStatus: 'Upload File'
  }

  componentDidMount(){
    const { title, actionUrl } = this.props

    axios.get(`/${actionUrl}/download_template`)
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
      this.setState({TemplateBulk: '', confirmIsOpen: true, type: 'error', textSuccess: `Get bulk template for ${title} fail`, uploadStatus: 'Upload File'})
    })
  }

  uploadBulk = () => {
    const { title, actionUrl } = this.props

    if (this.refs.file.files) {
      this.setState({uploadStatus: 'Uploading File...'})

      const data = new FormData();
      data.append('file', this.state.upload[0]);
      axios.post(`/${actionUrl}/bulk`, data)
      .then(data => {
        let result = data.data;
        if(result.meta.status === false){
          this.setState({confirmIsOpen: true, type: 'error', textError: result.meta.message, uploadStatus: 'Upload File'})
        }else{
          this.setState({confirmIsOpen: true, type: 'success', textSuccess: `Bulk upload ${title} sukses`, uploadStatus: 'Upload File'})
        }
      })
      .catch(e => {
        this.setState({confirmIsOpen: true, type: 'error', textSuccess: `Bulk upload ${title} gagal`, uploadStatus: 'Upload File'})
      })
    }
  }

  render() {
    const { title, actionUrl, history } = this.props
    const { confirmIsOpen, TemplateBulk, type, textSuccess, textError, upload, uploadStatus } = this.state

    return (
      <React.Fragment>
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({confirmIsOpen: false})}
          confirmSuccess={() => history.push(`/${actionUrl}`)}
          textSuccess={textSuccess}
          textError={textError}
        />

        <div className="card mb-5">
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-12 col-lg-6">
                <h6>Set {title} Bulk</h6>
                <div className="form-group mt-4 mb-2">
                  <input type='file' ref='file' onChange={e => this.setState({upload: e.target.files})} />
                </div>
              </div>
            </div>
            <a href="#" className={`btn btn-block ${upload === '' ? 'btn-danger disabled' : 'btn-outline-danger'}`} onClick={() =>{
              this.uploadBulk()
            }}>{uploadStatus}</a>
          </div>
          {TemplateBulk.length > 0 &&
            <div className="card-footer card-footer-button text-center">
              <a href={TemplateBulk} target="_blank">Download file template</a>
            </div>
          }
        </div>
      </React.Fragment>
    );
  }
}

export default BulkCreate