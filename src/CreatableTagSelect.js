import React, { Component } from 'react'
import CreatableSelect from 'react-select/creatable'

import { capitalize, caseInsensitiveFind } from './utils'

export default class CreatableTagSelect extends Component {
  static defaultProps = {
    options: [],
    placeholder: 'Select or type something and press enter...',
    noOptionsMessage: () => null,
  }

  state = {
    inputValue: '',
    menuOpen: false,
  }

  handleInputChange = (inputValue: string) => {
    this.setState({
      inputValue: inputValue.slice(0, 50),
    })
  }

  handleOnBlur = () => {
    const { inputValue } = this.state

    if (inputValue !== '') {
      this.handleAdd(capitalize(inputValue))
    }
    this.setState({ menuOpen: false })
  }

  handleKeyDown = e => {
    if ([',', ';'].includes(e.key)) {
      e.preventDefault()

      const { inputValue } = this.state
      const { options } = this.props

      if (inputValue === '') {
        return
      }

      this.setState({
        inputValue: '',
      })

      const values = options.map(({ value }) => value)
      const caseInsensitiveMatch = caseInsensitiveFind(inputValue, values)

      let valueToAdd
      if (caseInsensitiveMatch) {
        valueToAdd = caseInsensitiveMatch
      } else {
        valueToAdd = capitalize(inputValue)
      }
      this.handleAdd(valueToAdd)
      this.setState({ menuOpen: false })
      return
    }
    if (!e.key.startsWith('Arrow')) {
      this.setState({ menuOpen: true })
    }
  }

  handleAdd = (selected: string) => {
    const { handleAdd } = this.props
    handleAdd(selected)
  }

  render() {
    const { inputValue, menuOpen } = this.state
    const {
      handleChange,
      values,
      options,
      placeholder,
      noOptionsMessage,
    } = this.props
    return (
      <CreatableSelect
        styles={{
          control: base => ({ ...base, backgroundColor: 'white' }),
          multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' }),
        }}
        value={values.map(value => ({ label: value, value }))}
        onInputChange={this.handleInputChange}
        menuIsOpen={menuOpen}
        inputValue={inputValue}
        className="column"
        isMulti
        onChange={(newValues, meta) => {
          this.setState({ menuOpen: false })
          handleChange(newValues, meta)
        }}
        onKeyDown={this.handleKeyDown}
        onFocus={() => {
          this.setState({ menuOpen: true })
        }}
        onBlur={this.handleOnBlur}
        options={options}
        placeholder={placeholder}
        noOptionsMessage={noOptionsMessage}
      />
    )
  }
}
