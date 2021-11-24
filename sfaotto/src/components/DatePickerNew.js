import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IconCalendar } from "../components/Icons";

const DatePickerNewComponent = ({handleChange, value, required, disabled, yearDropdownItemNumber, placeholder, maxDate, className}) => {
	if (yearDropdownItemNumber === '') {
		yearDropdownItemNumber = 50
	}

	if (!className) {
		className = "form-control form-control-line"
	}

	return (
        <div className="input-filter-2">
            <IconCalendar/>
            <DatePicker
                className={className}
                style={{position: 'absolute'}}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={yearDropdownItemNumber}
                placeholderText={ placeholder ? placeholder : "dd-mm-yyyy"}
                maxDate={maxDate ? moment(maxDate, 'YYYY-MM-DD') : null}
                dateFormat="DD-MM-YYYY"
                selected={value ? moment(value, 'YYYY-MM-DD') : null}
                onChange={(value) => {
                    handleChange(value.format('YYYY-MM-DD'))
                }}
                disabled={disabled}
                required={required}
            />
        </div>
	)
}

export default DatePickerNewComponent
