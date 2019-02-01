import React, { Component } from 'react'
import CreatableSelect from 'react-select/lib/Creatable'

export default class CreatableTagSelect extends Component<
  { options: Array<string>, values: Array<string>, handleSelect: any => void },
  { inputValue: string }
> {
  state = {
    inputValue: '',
  }

  handleInputChange = inputValue => {
    this.setState({ inputValue: inputValue.slice(0, 50) })
  }

  render() {
    const { options, handleSelect, values } = this.props
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
        onChange={handleSelect}
        placeholder="Select or type something and press enter..."
      />
    )
  }
}
