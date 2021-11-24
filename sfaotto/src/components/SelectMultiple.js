import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

const SelectMultiple = ({ options, initValue, handleChange, isDisabled, placeholder }) => {
  return (
    <Select
      className='select-line w-100'
      isMulti
      classNamePrefix='select-line-inner'
      value={initValue}
      components={makeAnimated()}
      options={options}
      isDisabled={isDisabled}
      placeholder={placeholder}
      onChange={selectedData => handleChange(selectedData)}
    />
  );
}

export default SelectMultiple
