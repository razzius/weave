import React, { Component } from 'react';

import CreatableSelect from 'react-select/lib/Creatable';

import { capitalize } from './utils'

const components = {
  DropdownIndicator: null,
};

export default class CreatableInputOnly extends Component {
  state = {
    inputValue: '',
  };

  handleChange = (value) => {
    this.props.handleSet( value );
  };

  handleInputChange = (inputValue) => {
    this.setState({ inputValue });
  };

  handleKeyDown = (event) => {
    const { inputValue } = this.state;
    if (!inputValue) return;
    if (['Enter', 'Tab'].includes(event.key)) {
      this.setState({
        inputValue: '',
      });
      this.props.handleChange(capitalize(inputValue))
      event.preventDefault();
    }
  };

  render() {
    const { inputValue } = this.state;
    return (
      <CreatableSelect
        styles={{
          control: (base) => ({ ...base, backgroundColor: 'white' })
        }}
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder="Type something and press enter..."
        value={this.props.value}
      />
    );
  }
}
