// @flow
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { getProfiles } from './api'
import AppScreen from './AppScreen'
import SearchInput from './SearchInput'
import ResultsView from './ResultsView'

type Props = Object
type State = Object

const originalState = {
  loading: true,
  degrees: [],
  affiliations: [],
  searchTerms: [],
  search: '',
  results: null,
  queried: false,
  error: null,
  page: 1,
}

class Browse extends Component<Props, State> {
  state = originalState

  async componentDidMount() {
    const { token, location } = this.props
    const { page } = this.state

    if (location.state) {
      this.loadProfilesFromHistory(location.state)
    } else {
      this.loadProfilesFromServer({ token, page })
    }
  }

  loadProfilesFromHistory = state => {
    this.setState(state, () => {
      window.scrollTo(0, state.scrollY)
    })
  }

  loadProfilesFromServer = async ({ token, page }) => {
    const { history } = this.props
    try {
      this.setState({
        results: await getProfiles({ token, page }),
        loading: false,
      })
      history.replace('/browse', this.state)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      this.setState({ error: 'Unable to load profiles. Try again later.' })
      throw err
    }
  }

  handleSearch = async () => {
    const { history, token } = this.props

    this.setState({ loading: true })

    const {
      searchTerms,
      search,
      page,
      results,
      degrees,
      affiliations,
    } = this.state

    const searchArray = search === '' ? [] : [search]
    const query = searchTerms
      .concat(searchArray)
      .join(' ')
      .toLowerCase()

    const newResults = await getProfiles({
      token,
      query,
      page,
      degrees,
      affiliations,
    })

    if (results !== null && page > 1) {
      const updatedProfiles = results.profiles.concat(newResults.profiles)

      this.setState({
        results: {
          ...results,
          profiles: updatedProfiles,
        },
        loading: false,
      })
    } else {
      this.setState({ results: newResults, loading: false })
    }
    history.replace('/browse', this.state)
  }

  handleChange = tags => {
    const searchTerms = tags !== null ? tags.map(tag => tag.value) : []

    this.setState(
      {
        queried: true,
        searchTerms,
        page: 1,
      },
      this.handleSearch
    )
  }

  handleChangeDegrees = tags => {
    this.setState(
      {
        queried: true,
        degrees: tags.map(tag => tag.value),
        page: 1,
      },
      this.handleSearch
    )
  }

  handleChangeAffiliations = tags => {
    this.setState(
      {
        queried: true,
        affiliations: tags.map(tag => tag.value),
        page: 1,
      },
      this.handleSearch
    )
  }

  handleInputChange = (value, { action }) => {
    // Weird case. Deserves being written up. See
    // https://github.com/JedWatson/react-select/issues/1826#issuecomment-406020708
    if (['input-blur', 'menu-close'].includes(action)) {
      // eslint-disable-next-line no-console
      console.log(`Not going to do anything on action ${action}`)
      return
    }

    this.setState({ search: value, page: 1 })
  }

  handleKeyDown = (e: SyntheticKeyboardEvent<HTMLElement>) => {
    if ([',', ';'].includes(e.key)) {
      e.preventDefault()

      const { search, searchTerms } = this.state

      if (search === '') {
        return
      }

      if (searchTerms.includes(search)) {
        this.setState({ search: '' })
        return
      }

      this.setState(
        {
          search: '',
          searchTerms: [...searchTerms, search],
        },
        this.handleSearch
      )
    }
  }

  resetSearch = () => {
    this.setState(originalState, this.handleSearch)
  }

  nextPage = () => {
    const { page } = this.state
    this.setState({ page: page + 1 }, this.handleSearch)
  }

  render() {
    const {
      error,
      loading,
      results,
      searchTerms,
      search,
      degrees,
      queried,
      affiliations,
    } = this.state

    return (
      <AppScreen>
        <SearchInput
          values={searchTerms}
          search={search}
          degrees={degrees}
          affiliations={affiliations}
          inputValue={search}
          onChange={this.handleChange}
          onChangeDegrees={this.handleChangeDegrees}
          onChangeAffiliations={this.handleChangeAffiliations}
          onInputChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          onSubmit={() => {
            this.setState({ queried: true }, this.handleSearch)
          }}
        />
        <div style={{ padding: '1em 0' }}>
          <ResultsView
            queried={queried}
            resetSearch={this.resetSearch}
            loading={loading}
            results={results}
            error={error}
            nextPage={this.nextPage}
            savedState={this.state}
          />
        </div>
      </AppScreen>
    )
  }
}
export default withRouter(Browse)
