// @flow
import React, { Component } from 'react'
import CreatableSelect from 'react-select/lib/Creatable'

import { capitalize } from './utils'

type Props = {
  options: Array<string>,
  values: Array<string>,
  handleChange: any => void,
  placeholder?: string,
  handleAdd: any => void,
}

type State = {
  inputValue: string,
}

export default class CreatableTagSelect extends Component<Props, State> {
  static defaultProps = {
    placeholder: 'Select or type something and press enter...',
  }

  state = {
    inputValue: '',
  }

  handleInputChange = inputValue => {
    this.setState({ inputValue: inputValue.slice(0, 50) })
  }

  handleOnBlur = () => {
    const { inputValue } = this.state

    if (inputValue !== '') {
      this.handleAdd(capitalize(inputValue))
    }
  }

  handleKeyDown = event => {
    const { inputValue } = this.state
    if (!inputValue) return
    if (['Enter', 'Tab', ',', ';', '.'].includes(event.key)) {
      this.setState({
        inputValue: '',
      })
      this.handleAdd(capitalize(inputValue))
      event.preventDefault()
    }
  }

  handleAdd(selected) {
    const { handleAdd } = this.props
    handleAdd(selected)
  }

  render() {
    const { handleChange, values } = this.props
    const { inputValue } = this.state
    return (
      <CreatableSelect
        styles={{
          control: base => ({ ...base, backgroundColor: 'white' }),
          multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' }),
        }}
        inputValue={inputValue}
        value={values.map(value => ({ label: value, value }))}
        onInputChange={this.handleInputChange}
        className="column"
        isMulti
        onChange={handleChange}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleOnBlur}
        {...this.props}
      />
    )
  }
}
