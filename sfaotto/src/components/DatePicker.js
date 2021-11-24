import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = ({handleChange, value, maxDate, required}) => {
  return (
    <DatePicker
      className="form-control form-control-line"
      showMonthDropdown
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={50}
      placeholderText='dd-mm-yyyy'
      dateFormat="DD-MM-YYYY"
      // minDate={maxDate ? moment(maxDate, 'DD-MM-YYYY') : null}
      maxDate={maxDate ? moment(maxDate, 'DD-MM-YYYY').add(6, 'days') : moment(new Date(), 'DD-MM-YYYY')}
      selected={value ? moment(value, 'DD-MM-YYYY') : null}
      onChange={(value) => {
        handleChange(value ? value.format('DD-MM-YYYY') : null)
      }}
      required={required}
    />
  )
}

export default DatePickerComponent
