// @flow
import React, { Component } from 'react'

import CreatableSelect from 'react-select/lib/Creatable'

import { capitalize } from './utils'

const components = {
  DropdownIndicator: null
}

type Props = {
  handleAdd: string => void,
  handleSet: Array<string> => void,
  value: string,
}

type State = {
  inputValue: string
}

export default class CreatableInputOnly extends Component<Props, State> {
  state = {
    inputValue: ''
  }

  handleAdd = value => {
    const { handleAdd } = this.props
    handleAdd(value)
  }

  handleSet = (values) => {
    const { handleSet } = this.props
    handleSet(values)
  }

  handleInputChange = inputValue => {
    this.setState({ inputValue: inputValue.slice(0, 50) })
  }

  handleKeyDown = event => {
    const { inputValue } = this.state
    if (!inputValue) return
    if (['Enter', 'Tab', ',', ';', '.'].includes(event.key)) {
      this.setState({
        inputValue: ''
      })
      this.handleAdd(capitalize(inputValue))
      event.preventDefault()
    }
  }

  handleOnBlur = () => {
    const { inputValue } = this.state

    if (inputValue !== '') {
      this.handleAdd(capitalize(inputValue))
    }
  }

  render() {
    const { inputValue } = this.state
    const { value } = this.props

    return (
      <CreatableSelect
        styles={{
          control: base => ({ ...base, backgroundColor: 'white' }),
          multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' })
        }}
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        onBlur={this.handleOnBlur}
        menuIsOpen={false}
        onChange={this.handleSet}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder="Type something and press enter..."
        value={value}
      />
    )
  }
}
