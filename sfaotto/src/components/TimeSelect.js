import React from 'react'
import DatePicker from 'react-datepicker';
import moment from 'moment'
// import 'react-datepicker/dist/react-datepicker.css';

const TimeSelectComponent = ({handleChange, value, required, disabled}) => {

  return (
    <DatePicker
        className="form-control form-control-line"
        selected={value ? moment(value, 'HH:mm') : null}
        onChange={(value) => { if (value !== null) {
          handleChange(value.format('HH:mm'))
        } else {
          handleChange(value)
        }
        }}
        onSelect={(value) => { if (value !== null) {
          handleChange(value.format('HH:mm'))
        } else {
          handleChange(value)
        }
        }}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={5}
        timeFormat="HH:mm"
        dateFormat="HH:mm"
        placeholderText="00:00"
        disabled={disabled}
        required={required}
    />
  )
}

export default TimeSelectComponent
