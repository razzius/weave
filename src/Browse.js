import React, { Component } from 'react'
import tags from './tags'
import hospitals from './hospitals'
import ProfileResult from './ProfileResult'
import 'react-select/dist/react-select.css'
import SearchInput from './SearchInput'
import profiles from './profiles'

export default class Browse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      results: profiles
    }

    this.handleSearch = this.handleSearch.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSearch() {
    this.setState({
      results: profiles.filter(
        result => result.name.toLowerCase().includes(this.state.search.toLowerCase())
      )
    })
  }

  handleChange(event) {
    this.setState({ search: event.target.value })
  }

  render() {
    return (
      <div>
        <SearchInput value={this.state.search} onChange={this.handleChange} onSubmit={this.handleSearch}/>
        <p>Showing {this.state.results.length} results.</p>
        <div>
          {
            this.state.results.map(result => <ProfileResult key={result.id} {...result}/>)
          }
        </div>
      </div>
    )
  }
}
