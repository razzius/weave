import React, { Component } from "react"

export default class SearchInput extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.autocompleteWords = props.autocompleteWords
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.onSubmit()
  }

  render() {
    return (
      <form className="search" onSubmit={this.handleSubmit}>
        <input
          name="search"
          value={this.props.value}
          className="search-input"
          placeholder="Search"
          onChange={this.props.onChange}
        />
        <button className="search-submit" type="submit">
          Submit
        </button>
      </form>
    )
  }
}
