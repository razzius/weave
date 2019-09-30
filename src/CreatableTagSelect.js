// @flow
import React, { Component } from 'react'
import CreatableSelect from 'react-select/creatable'
import { type OptionsType } from 'react-select/src/types'

import { capitalize } from './utils'

type Props = {
  options?: OptionsType,
  values: Array<string>,
  handleChange: any => void,
  placeholder?: string,
  handleAdd: any => void,
  splitOnPunctuation?: boolean,
  noOptionsMessage?: ({ inputValue: string }) => string | null,
}

type State = {
  inputValue: string,
}

export default class CreatableTagSelect extends Component<Props, State> {
  static defaultProps = {
    placeholder: 'Select or type something and press enter...',
    splitOnPunctuation: false,
    noOptionsMessage: () => null,
  }

  state = {
    inputValue: '',
  }

  handleInputChange = (inputValue: string) => {
    this.setState({ inputValue: inputValue.slice(0, 50) })
  }

  handleOnBlur = () => {
    const { inputValue } = this.state

    if (inputValue !== '') {
      this.handleAdd(capitalize(inputValue))
    }
  }

  handleKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
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

  handleAdd(selected: string) {
    const { handleAdd } = this.props
    handleAdd(selected)
  }

  render() {
    const {
      handleChange,
      values,
      options,
      placeholder,
      splitOnPunctuation,
      noOptionsMessage,
    } = this.props
    return (
      // $FlowFixMe CreatableSelect props are not typechecking as expected
      <CreatableSelect
        styles={{
          control: base => ({ ...base, backgroundColor: 'white' }),
          multiValue: styles => ({ ...styles, backgroundColor: '#edf4fe' }),
        }}
        value={values.map(value => ({ label: value, value }))}
        onInputChange={this.handleInputChange}
        className="column"
        isMulti
        onChange={handleChange}
        onKeyDown={splitOnPunctuation ? this.handleKeyDown : () => {}}
        onBlur={this.handleOnBlur}
        options={options}
        placeholder={placeholder}
        noOptionsMessage={noOptionsMessage}
      />
    )
  }
}
