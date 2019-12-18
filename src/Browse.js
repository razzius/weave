// @flow
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import AppScreen from './AppScreen'
import ResultsView from './ResultsView'
import SearchInput from './SearchInput'
import { getProfiles } from './api'
import { searchableOptions } from './options'
import { partition } from './utils'

type Props = Object
type State = Object

const originalState = {
  affiliations: [],
  degrees: [],
  error: null,
  loading: true,
  menuOpen: false,
  page: 1,
  queried: false,
  results: null,
  search: '',
  searchTerms: [],
  sortAscending: false,
  sorting: 'date_updated',
}

const predefinedTags = new Set(searchableOptions.map(option => option.value))

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
      sorting,
      sortAscending,
    } = this.state

    const [knownTags, userTags] = partition(
      tag => predefinedTags.has(tag),
      searchTerms
    )
    const searchArray = search === '' ? [] : [search]
    const query = userTags
      .concat(searchArray)
      .join(' ')
      .toLowerCase()

    const searchDegrees = degrees === null ? [] : degrees
    const searchAffiliations = affiliations === null ? [] : affiliations

    const newResults = await getProfiles({
      token,
      query,
      tags: knownTags,
      page,
      degrees: searchDegrees,
      affiliations: searchAffiliations,
      sorting,
      sortAscending,
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
      const queried =
        query !== '' ||
        searchAffiliations.length ||
        searchDegrees.length ||
        page !== 1 ||
        sorting !== originalState.sorting
      this.setState({ results: newResults, loading: false, queried })
    }
    history.replace('/browse', this.state)
  }

  handleChange = tags => {
    const searchTerms = tags !== null ? tags.map(tag => tag.value) : []

    this.setState(
      {
        menuOpen: false,
        queried: true,
        searchTerms,
        page: 1,
      },
      this.handleSearch
    )
  }

  handleChangeDegrees = tags => {
    const degrees = tags === null ? null : tags.map(tag => tag.value)
    this.setState(
      {
        queried: true,
        degrees,
        page: 1,
      },
      this.handleSearch
    )
  }

  handleChangeAffiliations = tag => {
    this.setState(
      {
        queried: true,
        affiliations: [tag.value],
        page: 1,
      },
      this.handleSearch
    )
  }

  handleChangeSorting = option => {
    const { sorting, ascending } = option.value

    this.setState(
      {
        sorting,
        sortAscending: ascending,
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
        this.setState({ search: '', menuOpen: false })
        return
      }

      this.setState(
        {
          menuOpen: false,
          search: '',
          searchTerms: [...searchTerms, search],
        },
        this.handleSearch
      )
      return
    }
    if (!e.key.startsWith('Arrow')) {
      this.setState({ menuOpen: true })
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
      menuOpen,
    } = this.state

    return (
      <AppScreen>
        <SearchInput
          values={searchTerms}
          search={search}
          degrees={degrees}
          affiliations={affiliations}
          inputValue={search}
          menuOpen={menuOpen}
          onBlur={() => this.setState({ menuOpen: false })}
          onFocus={() => this.setState({ menuOpen: true })}
          onChange={this.handleChange}
          onChangeDegrees={this.handleChangeDegrees}
          onChangeAffiliations={this.handleChangeAffiliations}
          onChangeSorting={this.handleChangeSorting}
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
