import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = ({startDate, endDate, handleChange, value}) => {
  return (
    <DatePicker
      className="form-control form-control-select"
      showMonthDropdown
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={50}
      placeholderText='dd/mm/yyyy'
      dateFormat="DD/MM/YYYY"
      selectsEnd
      startDate
      endDate
      selected={value ? moment(value, 'DD/MM/YYYY') : null}
      onChange={(value) => {
        handleChange(value.format('DD/MM/YYYY'))
      }}
    />
  )
}

export default DatePickerComponent
