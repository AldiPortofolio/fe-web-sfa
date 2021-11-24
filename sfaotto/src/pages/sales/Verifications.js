import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getSales, deleteSale } from '../../actions/sale'
import { ModalDelete, SelectComponent, LoadingSpinner } from '../../components'

const style = {
  link: {
    cursor: 'pointer'
  }
}

const initState = {
  selectedGender: {value: '', label: 'Semua'},
  selectedCompCode: {value: '', label: 'Semua'},
  selectedRegional: {value: '', label: 'Semua'},
  keyword: '',
  id: '',
  confirmIsOpen: false,
  resultIsOpen: false,
  type: 'success',
}

class Verify extends React.Component {
  state = initState

  componentWillMount() {
    this.props.getSales({status: "Registered"})
  }

  componentDidMount(){
    document.title = "SFA OTTO - Verifikasi Sales"
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  hide(e, toggle) {
    // if(e && e.relatedTarget){
    //   e.relatedTarget.click();
    // }

    setTimeout(() => {
      let obj = {}
      obj[toggle] = !this.state[toggle]
      this.setState(obj)
    }, 175)
  }

  filterSales = () => {
    const { selectedGender, selectedCompCode, selectedRegional, keyword } = this.state
    this.props.getSales({status: "Registered", gender: selectedGender.value, company_code: selectedCompCode.value, province_id: selectedRegional.value, keyword})
  }

  render() {
    const { deleteSale, sales, genders, provinces } = this.props
    const { id, confirmIsOpen, resultIsOpen, type, keyword, selectedGender, selectedRegional } = this.state

    return (
      <div className="container">
        <div className="row">
          <ModalDelete
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            resultClose={() => this.setState({resultIsOpen: false})}
            confirmYes={() => {
              this.setState({confirmIsOpen: false}, () => {
                deleteSale(id)
                  .then((data) => {
                    let updateState = {
                      ...initState,
                      resultIsOpen: true
                    }
                    this.setState(updateState, () => this.filterSales() )
                  })
                  .catch(e => this.setState({resultIsOpen: true, type: 'error'}))
              })
            }}
          />
          <div className="col-12">
            <nav className="d-flex justify-content-end" aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Verifikasi sales</li>
              </ol>
            </nav>
          </div>
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h4 className="text-uppercase float-left">List Sales</h4>
                  </div>
                  <div className="col-12">
                    <form className="form-inline my-3 d-flex justify-content-between">
                      <div className="d-flex">
                        <div className="form-group mr-3">
                          <small className="text-gray">Jenis Kelamin</small>
                          <div style={{zIndex: '100'}} className="ml-2">
                            <SelectComponent options={genders.data} initValue={selectedGender}
                              handleChange={(selectedGender) => this.setState({selectedGender}, () => this.filterSales()) }
                            />
                          </div>
                        </div>
                        <div className="form-group mr-3">
                          <small className="text-gray">Regional</small>
                          <div style={{zIndex: '100'}} className="ml-2">
                            <SelectComponent options={provinces.data} initValue={selectedRegional}
                              handleChange={(selectedRegional) => this.setState({selectedRegional}, () => this.filterSales()) }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group form-icon mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input placeholder='Cari di sini...' className='form-control form-control-circle' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterSales() )} />
                      </div>
                    </form>
                  </div>
                  <div className="col-12 pb-3">
                    <div className="table-fixed">
                      <div className="table-body">
                        <table className="table table-header mb-5">
                          <thead>
                            <tr>
                              <th width="25%">Nama</th>
                              <th width="18.5%">No KTP</th>
                              <th width="18.5%">No HP</th>
                              <th width="18.5%">Email</th>
                              <th width="18.5%">Regional</th>
                            </tr>
                          </thead>
                          {sales.loading ?
                            <tbody>
                              <tr>
                                <td colSpan={8}><LoadingSpinner /></td>
                              </tr>
                            </tbody>
                            :
                            <tbody>
                              {sales.data.length > 0 &&
                                sales.data.salesmen.map(sale => (
                                <tr key={sale.id}>
                                  <td>
                                    <Link to={`/sales/verify/${sale.id}`} style={style.link}>
                                    {sale.first_name} {sale.last_name}
                                    </Link>
                                  </td>
                                  <td>{sale.id_number}</td>
                                  <td>{sale.phone}</td>
                                  <td>{sale.email}</td>
                                  <td>{sale.province}</td>
                                </tr>
                              ))}
                            </tbody>
                          }
                          {
                            sales.data.length === 0 &&
                            <tbody>
                              <tr>
                                <td colSpan={5} className="text-center">
                                  <p className="mb-0">No sales need to verify</p>
                                </td>
                              </tr>
                            </tbody>
                          }
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, sales, genders, company_codes, provinces}) => ({ auth, sales, genders, company_codes, provinces }),
  {getSales, deleteSale}
)(Verify)
