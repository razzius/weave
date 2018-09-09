import React, { Component } from 'react'
import 'react-select/dist/react-select.css'
import ProfileResult from './ProfileResult'
import SearchInput from './SearchInput'
import { getProfiles } from './api'
import AppScreen from './AppScreen'

function pluralizeResults(length) {
  if (length === 1) {
    return 'result'
  }
  return 'results'
}

export default class Browse extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTerms: [],
      search: '',
      results: null,
      queried: false,
      error: null
    }

    getProfiles(props.token)
      .then(results => {
        this.setState({ results })
      })
      .catch(() =>
        this.setState({ error: 'Unable to load profiles. Try again later.' })
      )
  }

  handleSearch = (reset = false) => {
    const { token } = this.props
    const { searchTerms, search } = this.state
    const searchArray = search === '' ? [] : [search]
    const searchString = searchTerms
      .concat(searchArray)
      .join(' ')
      .toLowerCase()

    const query = reset ? '' : searchString

    getProfiles(token, query).then(results => {
      this.setState({ results })
      if (!reset) {
        this.setState({ queried: true })
      }
    })
  }

  handleChange = tags => {
    this.setState(
      { searchTerms: tags.map(tag => tag.value) },
      this.handleSearch
    )
  }

  handleInputChange = value => {
    this.setState({ search: value })
    return value
  }

  render() {
    const { error, results } = this.state
    return (
      <AppScreen>
        <SearchInput
          value={this.state.searchTerms}
          inputValue={this.state.search}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          onSubmit={this.handleSearch}
        />
        {(error !== null && error) ||
          (results === null && <p>Loading...</p>) || (
            <div>
              <p>
                Showing {this.state.results.length}{' '}
                {pluralizeResults(this.state.results.length)}.{' '}
                {this.state.queried && (
                  <button
                    onClick={() => {
                      this.setState({
                        searchTerms: [],
                        search: ''
                      })
                      this.handleSearch(true)
                      this.setState({
                        queried: false
                      })
                    }}
                  >
                    Clear search
                  </button>
                )}
              </p>
              <div>
                {this.state.results.map(result => (
                  <ProfileResult key={result.id} {...result} />
                ))}
              </div>
            </div>
          )}
      </AppScreen>
    )
  }
}
