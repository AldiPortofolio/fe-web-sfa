import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux'
import { ModalConfirm } from '../../components'
import axios from '../../actions/config';
import { ind, en } from '../../languages/position'

class BulkAssignPosition extends React.Component {
  state = {
    confirmIsOpen: false,
    TemplateBulk: '',
    type: '',
    textSuccess: '',
    textError: '',
    upload: '',
    uploadStatus: 'Upload'
  }

  componentDidMount(){
    const { title, auth, actionUrl } = this.props

    if (auth.language === 'in'){
      this.setState({language: ind.bulk})
    } else if (auth.language === 'en'){
      this.setState({language: en.bulk})
    }

    axios.get(`/sales_management/functional_position_template`)
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
      this.setState({TemplateBulk: '', confirmIsOpen: true, type: 'error', textSuccess: `Get bulk template for ${title} fail`, uploadStatus: 'Upload'})
    })
  }

  uploadSalesAssigmentBulk = () => {
    if (this.refs.file.files) {
      this.setState({uploadStatus: 'Uploading File...'})

      const data = new FormData();
      data.append('file', this.state.upload[0]);
      axios.post('sales_management/bulk_functional_position', data)
      .then(data => {
        let result = data.data;
        if(result.meta.status === false){
          this.setState({confirmIsOpen: true, type: 'error', textError: result.meta.message, uploadStatus: 'Upload'})
        }else{
          this.setState({confirmIsOpen: true, type: 'success', textError: '', textSuccess: 'Bulk assign position sales sukses', uploadStatus: 'Upload'})
        }
      })
      .catch(e => {
        this.setState({confirmIsOpen: true, type: 'error', textSuccess: 'Bulk assign position sales gagal', uploadStatus: 'Upload'})
      })
    }
  }

  render() {
    const { history } = this.props
    const { TemplateBulk, confirmIsOpen, type, textSuccess, textError, upload, uploadStatus } = this.state

    return (
      <React.Fragment>
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({confirmIsOpen: false})}
          confirmSuccess={() => history.push('/sales')}
          textSuccess={textSuccess}
          textError={textError}
        />

        <div className="card mb-5">
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-12 col-lg-12">
                <h6>Assign Position Bulk</h6>
                <div className="form-group mt-4 mb-2">
                  <input type='file' ref='file' onChange={e => this.setState({upload: e.target.files})} />
                </div>
              </div>
            </div>
            <a href="#" className={`btn btn-block ${upload === '' ? 'btn-danger disabled' : 'btn-danger'}`} onClick={() =>{
              this.uploadSalesAssigmentBulk()
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

// export default BulkAssignPosition
export default connect(
  (auth) => (auth),
)(BulkAssignPosition)