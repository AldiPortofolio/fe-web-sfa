import React from 'react';
import { SelectLineComponent } from '../../components'

const RegionFrom = ({options, handleChange, empty}) => {
  return (
    <div className="col-12 col-lg-6">
      <div className="form-group mt-3 mb-2">
        <label>Regional Code</label>
        <SelectLineComponent options={options} placeholder="Type Region" handleChange={handleChange()}/>
        {
          empty &&
          <small className="text-danger">This Region have no Coverage yet.</small>
        }
      </div>
    </div>
  )
}

export default RegionFrom