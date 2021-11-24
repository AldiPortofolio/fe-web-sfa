import React from 'react'
import { debounce, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getRegions } from '../../actions/region'
import { getAssignmentSales, deleteSale } from '../../actions/sale'
import { NotAuthorize, ModalDelete, LoadingDots, Pagination } from '../../components'
import { IconSearch, IconEdit } from '../../components/Icons'
import { ind, en } from '../../languages/assignment'

const initState = {
  selectedGender: {value: '', label: 'Semua'},
  selectedCompCode: {value: '', label: 'Semua'},
  selectedRegion: {value: '', label: 'Semua'},
  selectedStatus: [],
  keyword: '',
  id: '',
  params: '',
  confirmIsOpen: false,
  resultIsOpen: false,
  type: 'success',
  language: {},
}

class Assignment extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Assignment Sales"

    if (this.props.auth.language === 'in'){
      this.setState({language: ind.table})
    } else if (this.props.auth.language === 'en'){
      this.setState({language: en.table})
    }
    
    this.fetchSales(window.location.search)
    this.props.getRegions()
  }

  componentDidUpdate(prevProps) {

    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchSales(this.props.location.search);
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
    }, 175)
  }

  getLastPostion = (sales) => {
    if(!isEmpty(sales.position.sub_area)){
      return sales.position.sub_area
    }else if(!isEmpty(sales.position.area)){
      return sales.position.area
    }else if(!isEmpty(sales.position.branch)){
      return sales.position.branch
    }else if(!isEmpty(sales.position.region)){
      return sales.position.region
    }
  }

  filterSales = debounce(() => {
    if (this.props.auth.language === 'in'){
      this.setState({language: ind.table})
    } else if (this.props.auth.language === 'en'){
      this.setState({language: en.table})
    }
    this.props.getAssignmentSales(`?keyword=${this.state.keyword}`)
  }, 350)

  fetchSales = (pageNumber) => {
    let page = "?page=1";

    if(pageNumber){
      page = pageNumber.includes("page") ? pageNumber : "?page=1"
    }

    this.props.getAssignmentSales(page)
  }

  render() {
    const { auth, deleteSale, regions, sales } = this.props
    const { id, confirmIsOpen, resultIsOpen, type, keyword, selectedRegion, selectedStatus, language } = this.state

    if (auth.isAuthenticated && (auth.authority["list_assignment_sales"] === "" || auth.authority["list_assignment_sales"] === "No Access")) {
      return <NotAuthorize />
    }

    let newRegions = []
    regions.data.map(region => newRegions.push({value: region.id, label: region.name}))

    let newParams = ""

    if(selectedRegion.value){
      newParams = newParams + `&region_id=${selectedRegion.value}`
    }

    if(selectedStatus.length > 0){
      newParams = newParams + `&status=${selectedStatus.join()}`
    }

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
          <div className="col-12 mb-5">
            <h2>{language.header}</h2>
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <form className="form-inline my-3 d-flex justify-content-end">
                      <div className="form-group input-action mr-3 w-30">
                        <IconSearch/>
                        <input placeholder='Search Sales...' className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterSales() )} />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="table-fixed">
                <table className="table table-header table-striped mb-0">
                  <thead>
                    <tr>
                      <th width="2%"><input type="checkbox" /></th>
                      <th width="10%">{language.id}</th>
                      <th width="20%">{language.phone}</th>
                      <th width="20%">{language.sales}</th>
                      <th width="20%">{language.regional}</th>
                      <th width="20%">{language.subArea}</th>
                      <th width="5%"></th>
                    </tr>
                  </thead>
                  {sales.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={6}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {sales.assignments && sales.assignments.map((sales_assigned, idx) => (
                        <tr key={sales_assigned.id + sales_assigned.sales_name + idx}>
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td className="text-capitalize">{sales_assigned.id}</td>
                          <td>{sales_assigned.phone}</td>
                          <td>{sales_assigned.sales_name}</td>
                          <td>{sales_assigned.area_positions ? sales_assigned.area_positions : "-"}</td>
                          <td>{isEmpty(sales_assigned.villages) ? "-" : sales_assigned.villages}</td>
                          <td className="d-flex align-items-center justify-content-center">
                            { auth.authority["assignment_sales"] === "Full Access" &&
                              <Link to={`/sales/assignments/${sales_assigned.id}/edit`} className="px-2 btn-circle">
                                <IconEdit/>
                              </Link>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  }
                  {(!sales.loading && isEmpty(sales.assignments)) &&
                    <tbody>
                      <tr>
                        <td colSpan={8} className="text-center">{language.noData}</td>
                      </tr>
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={sales.meta} routeName="sales/assignments" parameter={newParams} handleClick={(pageNumber) => this.fetchSales(pageNumber)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, sales, regions}) => ({ auth, sales, regions }),
  {getAssignmentSales, deleteSale, getRegions}
)(Assignment)
