import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { NotAuthorize } from '../../components'
import axios from '../../actions/config'
import { getCategoryDetail } from '../../actions/attendance_category'
import { ind, en } from '../../languages/attendance_category'

class Detail extends React.Component {
  state = {
    all: {},
    category_name: '',
    time_in: '',
    time_out: '',
    category_type: 'all',
    type: '',
    type_modal: 'success',
    confirmText: 'Apakah Anda yakin untuk menghapus data ini?',
    resultText: 'Berhasil menghapus data.',
    selectedFilter: true,
    confirmIsOpen: false,
    resultIsOpen: false,
    isLoading: false,
    messages: [
      {sub_category_id: '', supplier_name: '', file_edukasi: ''},
    ],
    languages: {},
  }

  componentWillMount() {
    const { auth: {access_token}, match, getCategoryDetail} = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.detail})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.detail})
    }

    getCategoryDetail(match.params.id)
      .then((data) => {
        var dataAll = data.data

          if (dataAll.type === '0'){
            this.setState({type: this.state.languages.all})
          } else if (dataAll.type === '1'){
            this.setState({type: this.state.languages.in})
          } else if (dataAll.type === '2'){
            this.setState({type: this.state.languages.out})
          }
        this.setState({all: dataAll})
      })

  }

  componentDidMount(){
    document.title = "SFA OTTO - Detail Category"
  }

  render() {
    const { auth } = this.props
    const { 
      all,
      languages,
      type
    } = this.state

    if (auth.isAuthenticated && (auth.authority["add_todo_list"] === "" || auth.authority["add_todo_list"] === "No Access")) {
      return <NotAuthorize />
    }

    return (
      <div className="container">
        <div className="row">

          <div className="col-12 mb-4">
            <h2>{languages.header} (ID - {all.category_id})</h2>
          </div>
          
          <div className="col-12 mt-4 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row"> 
                  <div className="col-12 col-lg-7">
                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.categoryName}</label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input type="Text" onChange={e => this.setState({category_name: e.target.value})} value={all.category_name} className="form-control form-control-line w-30" placeholder="category name"  disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.type} </label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input type="text" value={type} className="form-control form-control-line w-30" placeholder="Type" disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-3">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.in} </label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input type="text" value={all.time_in ? all.time_in : '-'} className="form-control form-control-line w-30" placeholder="Time In" disabled/>
                      </div>
                    </div>

                    <div className="form-inline my-2">
                      <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.out} </label></div>
                      <div className="col-lg-9 input-filter ml-7">
                        <input type="text" value={all.time_out ? all.time_out : '-'} className="form-control form-control-line w-30" placeholder="Time Out" disabled/>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <hr className="content-hr"/>
        <div className="col-12 mt-4">
          <div className="col-12 form-inline">
            <div className="col-lg-10">
              <Link to="/attendance/category" className="btn btn-default w-20">{languages.back} </Link>
            </div>
            <div className="col-lg-2">
                {/* <button className="btn btn-default mr-1 ml-5" onClick={() => this.setState({confirmIsOpen: true})}>
                    Delete
                </button> */}
                {(auth.authority["attendance_category"] === "Full Access") ?
                  <Link to={`/attendance/category/edit/${all.category_id}`} className="btn btn-danger w-50">{languages.edit}</Link>
                  :
                  <td></td>
                }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth }) => ({ auth }),
  { getCategoryDetail }
)(Detail)
