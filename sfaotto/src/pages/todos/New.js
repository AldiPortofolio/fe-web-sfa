import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isNaN } from 'lodash'
import { createTodo } from '../../actions/todos'
import { getSaleDetail } from '../../actions/sale'
import { NotAuthorize, ModalConfirm, SelectLineComponent } from '../../components'
import axios from '../../actions/config'

class Register extends React.Component {
  state = {
    merchant_id: '',
    merchant_name: '',
    merchant_address: '',
    merchant_phone: '',
    merchant_phone_area: '+62',
    sales_name: '',
    sales_phone: '',
    sales_phone_area: '+62',
    selectedCategory: {},
    todoCategories: [
      {value: 0, label: "Akuisisi"},
      {value: 1, label: "Edit Foto"},
      {value: 2, label: "Message"}
    ],
    message: null,
    confirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
  }

  componentWillMount() {
    const { auth: {access_token} } = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
  }

  componentDidMount(){
    document.title = "SFA OTTO - Set To-do List"
  }

  render() {
    let allFilled = false
    const { auth, createTodo, getSaleDetail, history } = this.props
    const { todoCategories,
      upload,
      merchant_id,
      merchant_name,
      merchant_address,
      merchant_phone,
      merchant_phone_area,
      sales_name,
      sales_phone,
      sales_phone_area,
      message,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      selectedCategory } = this.state

    if (auth.role === 'Manager' || auth.role === 'ASM' || auth.role === 'TL') {
      return <NotAuthorize />
    }

    if(selectedCategory.value !== undefined){
      if (selectedCategory.value === 0 && (sales_phone && merchant_name && merchant_address && merchant_phone && message)) {
        allFilled = true
      }else if (selectedCategory.value === 1 && (sales_phone && merchant_id && message)) {
        allFilled = true
      }else if(selectedCategory.value === 2 && (sales_phone && message)){
        allFilled = true
      }
    }

    return (
      <div className="container mb-5">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => history.push('/todos/')}
            textSuccess={textSuccess}
            textError={textError}
          />

          <div className="col-12 col-lg-8 mb-4">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="text-uppercase mb-0">Form To-do List</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (selectedCategory.value === 0) {
                      createTodo({sales_phone, category: selectedCategory.value, merchant_name, merchant_address, merchant_phone, message })
                        .then(data => this.setState({confirmIsOpen: true, type: 'success', textError: '', textSuccess: 'Tambah To-do List sukses'}))
                        .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
                    }else if (selectedCategory.value === 1) {
                      createTodo({sales_phone, category: selectedCategory.value, merchant_id, message })
                        .then(data => this.setState({confirmIsOpen: true, type: 'success', textError: '', textSuccess: 'Tambah To-do List sukses'}))
                        .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
                    }else{
                      createTodo({sales_phone, category: selectedCategory.value, message})
                        .then(data => this.setState({confirmIsOpen: true, type: 'success', textError: '', textSuccess: 'Tambah To-do List sukses'}))
                        .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
                    }
                  }}
                  className="mt-4">
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">No Handphone</label>
                        <div className="form-row">
                          <div className="col-3 col-lg-3">
                            <select className="custom-select-line text-center" onChange={e => this.setState({sales_phone_area: e.target.value})} value={sales_phone_area}>
                              <option value='+62'>+62</option>
                            </select>
                          </div>
                          <div className="col-9">
                            <input
                              onChange={e => {
                                if (isNaN(Number(e.target.value)) || e.target.value.split('').length > 16) {
                                  return
                                }
                                this.setState({sales_phone: e.target.value})
                              }}

                              onBlur={e => {
                                getSaleDetail({phone: e.target.value, name: sales_name})
                                  .then(data => this.setState({sales_name: data.data.name}))
                                  .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
                              }}
                              value={sales_phone} type="number" name="first-name" className="form-control form-control-line" placeholder="812 3456 7890" maxLength="12" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Nama sales</label>
                        <input onChange={e => this.setState({sales_name: e.target.value})}
                          onBlur={e => {
                            getSaleDetail({phone: " ", name: e.target.value})
                              .then(data => this.setState({sales_phone: data.data.phone}))
                              .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: e.message}))
                          }}
                          value={sales_name} type="text" name="sales-name" className="form-control form-control-line" placeholder="Nama Sales" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="text-uppercase">Kategori</label>
                        <div className="custom-select-line">
                          <SelectLineComponent options={todoCategories} initValue={selectedCategory}
                            handleChange={(selectedCategory) => this.setState({selectedCategory}) }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  { selectedCategory.value === 0 &&
                    <div className="row mt-5">
                      <div className="col-12 mb-3">
                        <h5 className="text-uppercase">Merchant</h5>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label className="text-uppercase">Nama Merchant</label>
                          <input onChange={e => this.setState({merchant_name: e.target.value})} value={merchant_name} type="text" name="merchant-name" className="form-control form-control-line" placeholder="Masukan nama" />
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label className="text-uppercase">Alamat Merchant</label>
                          <input onChange={e => this.setState({merchant_address: e.target.value})} value={merchant_address} type="text" name="merchant-address" className="form-control form-control-line" placeholder="Masukan alamat" />
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label className="text-uppercase">No Handphone</label>
                          <div className="form-row">
                            <div className="col-3 col-lg-3">
                              <select className="custom-select-line text-center" onChange={e => this.setState({merchant_phone_area: e.target.value})} value={merchant_phone_area}>
                                <option value='+62'>+62</option>
                              </select>
                            </div>
                            <div className="col-9">
                              <input
                                onChange={e => {
                                  if (isNaN(Number(e.target.value)) || e.target.value.split('').length > 16) {
                                    return
                                  }
                                  this.setState({merchant_phone: e.target.value})
                                }}
                                value={merchant_phone} type="number" name="phone-number" className="form-control form-control-line" placeholder="812 3456 7890" maxLength="12" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label className="d-flex justify-content-between align-items-center"><span className="text-uppercase">Pesan</span> <em><small className="text-danger">*max 100 karakter</small></em></label>
                          <input onChange={e => this.setState({message: e.target.value})} value={message} type="text" name="message" className="form-control form-control-line" placeholder="Masukan pesan" />
                        </div>
                      </div>
                    </div>
                  }
                  { selectedCategory.value === 1 &&
                    <div className="row mt-5">
                      <div className="col-12 mb-3">
                        <h5 className="text-uppercase">Merchant</h5>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label className="text-uppercase">Merchant ID</label>
                          <div className="custom-select-line">
                            <input onChange={e => this.setState({merchant_id: e.target.value})} value={merchant_id} type="text" name="merchant-id" className="form-control form-control-line" placeholder="Masukan Merchant id" />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label className="text-uppercase">Nama Merchant</label>
                          <p>Nama Merchant</p>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label className="d-flex justify-content-between align-items-center"><span className="text-uppercase">Pesan</span> <em><small className="text-danger">*max 100 karakter</small></em></label>
                          <input onChange={e => this.setState({message: e.target.value})} value={message} type="text" name="first-name" className="form-control form-control-line" placeholder="Masukan pesan" />
                        </div>
                      </div>
                    </div>
                  }
                  { selectedCategory.value === 2 &&
                    <div className="row mt-5">
                      <div className="col-12 mb-3">
                        <h5 className="text-uppercase">Pesan</h5>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label className="d-flex justify-content-between align-items-center"><span className="text-uppercase">Isi</span> <em><small className="text-danger">*max 100 karakter</small></em></label>
                          <input onChange={e => this.setState({message: e.target.value})} value={message} type="text" name="first-name" className="form-control form-control-line" placeholder="Masukan pesan" />
                        </div>
                      </div>
                    </div>
                  }
                  <div className="row">
                    <div className="col-12 mt-4 text-right">
                      <button type="submit" disabled={!allFilled} className="btn btn-danger btn-rounded">Simpan</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center text-md-left">
                <div className="row">
                  <div className="col-12 col-lg-8 text-gray">
                    <h5 className="mb-0">Atur To-do List</h5>
                    <small className="mb-0">Lihat daftar to-do list dan lakukan perubahan data sesuai yang dibutuhkan</small>
                  </div>
                  <div className="col-12 col-lg-4 d-flex align-items-center mt-4 mt-lg-0 justify-content-center justify-content-lg-end">
                    <Link to="/todos/" className="btn btn-rounded btn-danger">Manage To-do List</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4 mb-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h4 className="text-uppercase">Set To-do List Bulk</h4>
                <p className="my-4">Lakukan set to-do list sekaligus banyak, dengan upload file .csv</p>
                <form
                  onSubmit={e => {
                    e.preventDefault()
                    if (this.refs.file.files) {
                      const data = new FormData();
                      data.append('file', upload[0]);
                      axios.post('/todo_list/bulk', data)
                        .then(data => this.setState({confirmIsOpen: true, type: 'success', textSuccess: 'Bulk upload Todo List sukses'}))
                        .catch(e => this.setState({confirmIsOpen: true, type: 'error', textError: 'Bulk upload Todo List gagal'}))
                    }
                  }}
                  >
                  <input type='file' ref='file' onChange={e => this.setState({upload: e.target.files})} />
                  <button type='submit' className="btn btn-outline-danger btn-rounded">Upload File</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, sales}) => ({ auth, sales }),
  {createTodo, getSaleDetail}
)(Register)
