// @flow
import React, { Component } from 'react'
import CreatableSelect from 'react-select/lib/Creatable'

type Props = {
  options: Array<string>,
  values: Array<string>,
  handleChange: any => void
}

type State = {
  inputValue: string
}

export default class CreatableTagSelect extends Component<Props, State> {
  state = {
    inputValue: '',
  }

  handleInputChange = inputValue => {
    this.setState({ inputValue: inputValue.slice(0, 50) })
  }

  render() {
    const { options, handleChange, values } = this.props
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
        options={options}
        onChange={handleChange}
        placeholder="Select or type something and press enter..."
      />
    )
  }
}
