import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import axios from '../../actions/config';
import { IconSearch, IconEye, IconEdit, IconTrash } from '../../components/Icons';

class CardTable extends React.Component {
  state = {
    keyword: ''
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  hide(e, toggle) {
    setTimeout(() => {
      let obj = {}
      obj[toggle] = false
      this.setState(obj)
    }, 175)
  }

  render() {
    const { name, detailName, targetTypes, targets, year, handleClick } = this.props
    const { keyword } = this.state

    let targetRegions = targets.filter(target => target.regional_name && target.regional_name.toLowerCase().includes(keyword.toLowerCase()));

    return (
      <div className="card mb-4">
        <div className="card-body d-flex align-items-center justify-content-between">
          <h6 className="mb-0">{name}</h6>
          <div className="form-group input-action w-30 mb-0">
            <IconSearch/>
            { /* <input placeholder='Search {name}...' className='form-control form-control-line' value="" onChange={e => this.setState({keyword: e.target.value}, () => this.filterSales() )} />*/}
            <input placeholder={`Search ${name}...`} className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value} )} />
          </div>
        </div>
        <div className="table-fixed">
          <table className="table table-header table-stripped">
            <thead>
              <tr>
                <th width="12%">{name} Code</th>
                <th width="20%">{name} Name</th>
                { targetTypes.data.map((target_type, idx) => (
                  <th key={idx}>{target_type.name}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              { targetRegions.map((target, idx) => (
                <tr key={idx}>
                  <td>{target.regional_id} - {target.regional_code}</td>
                  <td>
                    <a role="button" className="text-blue text-bold" onClick={() => handleClick(year, detailName, target.regional_id)} style={{cursor: "pointer"}}>
                      {target.regional_name}
                    </a>
                  </td>
                  { targetTypes.data.map((target_type, idx) => (
                    target.targets.map((target) => {
                      if(target.name === target_type.name){
                        return (
                          <td key={idx}>{target.value}</td>
                        )
                      }
                    })
                  ))}
                  <td>
                    <div className="dropdown ml-2">
                      <button
                        onClick={() => this.toggleDropdown(`show${target.regional_id}`)}
                        onBlur={(event) => this.hide(event,`show${target.regional_id}`)}
                        className="btn btn-circle btn-more dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                      </button>
                      <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${target.regional_id}`] ? 'show' : ''}`}
                        aria-labelledby="dropdownMenuButton">
                        <a style={{cursor: 'pointer'}} className="dropdown-item">
                          <IconEye/>
                          Lihat Detail
                        </a>
                        <a style={{cursor: 'pointer'}}
                          className="dropdown-item">
                          <IconEdit/> Ubah
                        </a>
                        <a style={{cursor: 'pointer'}}
                          className="dropdown-item">
                          <IconTrash/> Hapus
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {
            targets.length === 0 &&
            <p className="p-4 text-gray text-center col-12">No {name} target for {year}</p>
          }
        </div>
      </div>
    );
  }
}

export default CardTable