import React from 'react';
import Select from 'react-select';

const SelectComponentLoad = ({ options, initValue, handleChange, isDisabled, onFocus }) => {
  return (
    <Select
      className='select-line w-100'
      classNamePrefix='select-line-inner'
      value={initValue}
      options={options}
      isDisabled={isDisabled}
      onChange={selectedData => handleChange(selectedData)}
      onFocus={value => onFocus(value)}
    />
  );
}

export default SelectComponentLoad
