import React from 'react';
import { debounce, isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSalesLevels, deleteSalesLevel  } from '../../actions/sales_level';
import { NotAuthorize, ModalDelete, LoadingDots, Pagination } from '../../components';
import { IconTrash, IconEdit } from '../../components/Icons';
import Translator from '../../languages/Translator';

// const style = {
//   link: {
//     cursor: 'pointer'
//   }
// }

const initState = {
  id: '',
  level_name: '',
	id_delete: '',
  selected: [],
  calendar_ids: [],
  dateStatus: false,
  confirmIsOpen: false,
  resultIsOpen: false,
  confirmText: '',
  resultText: '',
  typeStatus: 'success',
  languages: {},
  tPages: {},
  tGeneral: {},
}

class Index extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Sales Level"
    
    if (this.props.auth.language === 'in'){
      this.setState({tPages: Translator('In').pages.salesLevel, tGeneral: Translator('In').general})
    } else if (this.props.auth.language === 'en'){
      this.setState({tPages: Translator('En').pages.salesLevel, tGeneral: Translator('En').general})
    }
    this.fetchSalesLevel(window.location.search)
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchSalesLevel(this.props.location.search);
    }
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  hide(e, toggle) {
    setTimeout(() => {
      let obj = {}
      obj[toggle] = !this.state[toggle]
      this.setState(obj)
    }, 200)
  }

  filterSalesLevel = debounce(() => {
    const { id, level_name } = this.state
    this.props.getSalesLevels({id, level_name})
  }, 350)

  fetchSalesLevel = (pageNumber) => {
    const { id, level_name } = this.state
    let page = "?page=1";

    if(pageNumber){
      page = pageNumber.includes("page") ? pageNumber : "?page=1"
    }

    this.props.getSalesLevels({id, level_name}, page)
  }

  render() {
    const { auth, sales_levels, deleteSalesLevel } = this.props
    const { 
      confirmIsOpen, 
      resultIsOpen, 
      id,
      level_name,
			id_delete,
      typeStatus, 
      dateStatus, 
      selected, 
      confirmText,
      resultText,
      tPages,
      tGeneral } = this.state

    if (auth.isAuthenticated && (auth.authority["sales_level"] === "" || auth.authority["sales_level"] === "No Access")) {
      return <NotAuthorize />
    }

    let newParams = ""

    return (
      <div className="container">
        <div className="row">

          <ModalDelete
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={typeStatus}
            confirmText={confirmText}
            resultText={resultText}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            resultClose={() => this.setState({resultIsOpen: false})}
            confirmYes={() => {
              this.setState({confirmIsOpen: false, confirmText: confirmText}, () => {
                deleteSalesLevel(id_delete)
									.then((data) => {
										if(data.meta.status === false){
												this.setState({resultIsOpen: true, typeStatus: 'error', resultText: data.meta.message})
										}else{
												this.setState({resultIsOpen: true, typeStatus: 'success', resultText: data.meta.message}, () => this.fetchSalesLevel())
										}
									})
									.catch(e => {
										this.setState({resultIsOpen: true, typeStatus: 'error', resultText: e.response.data})
									})
              })
            }}
          />
          <div className="col-12">
            <h2>{tPages.title}</h2>
            <div className="actions d-flex justify-content-end mb-3">
              {(auth.authority["sales_level"] === "Full Access") &&
                <Link to="/system-configuration/sales-level/new" className="btn btn-danger btn-rounded ml-3">{tPages.titleAdd}</Link>
              }
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  
                  <div className="col-12 mt-3">
                    <div className="row">

                      <div className="col-12 col-lg-4">
                        <div className="form-inline">
                            <div className="col-sm-2 d-flex"><label className="col-form-label">{tGeneral.id}</label></div>
                            <div className="col-lg-10 input-filter">
                                <input type="number" name="sales_phone" className="form-control form-control-line w-30" 
                                    placeholder={tGeneral.input+' '+tGeneral.id}
                                    onChange={e => {
                                    if (isNaN(Number(e.target.value))) {
                                        return
                                    }
                                    this.setState({id: e.target.value})
                                    }}
                                    value={id}
                                />
                            </div>
                        </div>
                      </div>

                      <div className="col-12 col-lg-5">
                        <div className={`form-inline d-flex ${selected.length > 0 || dateStatus ? '' : 'mb-3'}`}>
                            <div className="col-sm-4 d-flex"><label className="col-form-label">{tPages.levelName}</label></div>
                            <div className="col-lg-8 input-filter">
                                <input type="text" name="id" className="form-control form-control-line w-30" 
                                    placeholder={tGeneral.input+' '+tPages.levelName}
                                    onChange={e => {
                                    this.setState({level_name: e.target.value})
                                    }}
                                    value={level_name}
                                />
                            </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-3">
                        <div className={`form-inline d-flex ${selected.length > 0 || dateStatus ? '' : 'mb-3'}`}>
                          <div className="col-lg-8 d-flex">
                            <button type="submit" className="btn btn-danger w-100" onClick={() => {this.setState({page: 1}, () => this.filterSalesLevel())}}>{tGeneral.search}</button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>


              <div className="table-fixed">
                <table className="table table-header table-striped">
                  <thead>
                    <tr>
                      <th width="15%">{tGeneral.id}</th>
                      <th width="20%">{tPages.levelName}</th>
                      <th width="20%">Total</th>
                      <th width="20%">{tGeneral.desc}</th>
                      <th width="10%">{tGeneral.actions}</th>
                    </tr>
                  </thead>
                  {sales_levels.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={5}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {sales_levels.data && sales_levels.data.map((level, idx) => {
                        return(
                          <tr key={idx}>
                            <td className="text-capitalize">{level.id}</td>
                            <td className="text-capitalize">{level.name}</td>
                            <td className="text-capitalize">{level.total_merchant_visit}</td>
                            <td className="text-capitalize">{level.description}</td>
                            {(auth.authority["sales_level"] === "Full Access") ?
                                <td className="d-flex align-items-center justify-content-center">
                                    <Link to={`/system-configuration/sales-level/edit/${level.id}`} className="px-2 btn-circle">
                                        <IconEdit/>
                                    </Link>
                                    <button className="px-2 btn-circle text-danger"
                                    style={{cursor: 'pointer', color: '#007bff', background: 'transparent'}}
                                    onClick={() => this.setState({id_delete: level.id, confirmIsOpen: true, confirmText: "Apakah Anda yakin untuk menghapus data ini?"})}>
                                        <IconTrash/>
                                    </button>
                                </td>
                              :
                              <td></td>
                            }
                          </tr>
                        )
                      })}
                    </tbody>
                  }
                  {(!sales_levels.loading && isEmpty(sales_levels.data)) &&
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center">There is no Data</td>
                      </tr>
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={sales_levels.meta} routeName="system-configuration/sales-level" parameter={newParams} handleClick={(pageNumber) => this.fetchSalesLevel(pageNumber)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, sales_levels }) => ({ auth, sales_levels }),
  { getSalesLevels, deleteSalesLevel }
)(Index)
