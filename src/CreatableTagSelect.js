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
  splitOnPunctuation?: boolean,
  noOptionsMessage?: string => string | null,
}

type State = {
  inputValue: string,
}

export default class CreatableTagSelect extends Component<Props, State> {
  static defaultProps = {
    placeholder: 'Select or type something and press enter...',
    splitOnPunctuation: false,
    noOptionsMessage: null,
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
    if ([',', ';'].includes(event.key)) {
      const { inputValue } = this.state

      if (inputValue === '') {
        event.preventDefault()
        return
      }

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
    const {
      handleChange,
      values,
      options,
      placeholder,
      handleAdd,
      splitOnPunctuation,
      noOptionsMessage,
    } = this.props
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
        onKeyDown={splitOnPunctuation ? this.handleKeyDown : null}
        onBlur={this.handleOnBlur}
        options={options}
        handleChange={handleChange}
        placeholder={placeholder}
        handleAdd={handleAdd}
        noOptionsMessage={noOptionsMessage}
      />
    )
  }
}
