// @flow
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Beforeunload } from 'react-beforeunload'

import AppScreen from './AppScreen'
import ResultsView from './ResultsView'
import SearchInput from './SearchInput'
import { getProfiles, getSearchTags } from './api'
import { makeOptions } from './options'
import { partition } from './utils'

type Props = Object
type State = Object

const originalState = {
  affiliations: [],
  searchableTags: [],
  degrees: [],
  error: null,
  loading: true,
  menuOpen: false,
  page: 1,
  queried: false,
  results: null,
  search: '',
  searchTerms: [],
  sorting: 'starred',
  hospitalOptions: [],
}

class Browse extends Component<Props, State> {
  state = originalState

  async componentDidMount() {
    const { token, location } = this.props
    const { page } = this.state

    const { tags } = await getSearchTags(token)

    this.setState({
      searchableTags: makeOptions(
        [
          ...tags.clinical_specialties,
          ...tags.professional_interests,
          ...tags.activities,
          ...tags.parts_of_me,
        ].sort()
      ),
      hospitalOptions: makeOptions(tags.hospital_affiliations),
    })

    if (location.state) {
      this.loadProfilesFromHistory(location.state)
    } else {
      this.loadProfilesFromServer({ token, page })
    }
  }

  onUnload = () => {
    const { location, history } = this.props

    console.log('Clearing location.state from onUnload reload')
    history.replace(location.pathname, null)
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
      searchableTags,
      sorting,
    } = this.state

    const [knownTags, userTags] = partition(
      tag => searchableTags.includes(tag),
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
    const sorting = option.value

    this.setState(
      {
        sorting,
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
    const { searchableTags, hospitalOptions } = this.state
    this.setState(
      {
        ...originalState,
        searchableTags,
        hospitalOptions,
      },
      this.handleSearch
    )
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
      searchableTags,
      hospitalOptions,
    } = this.state

    return (
      <Beforeunload onBeforeunload={this.onUnload}>
        <AppScreen>
          <SearchInput
            values={searchTerms}
            search={search}
            degrees={degrees}
            affiliations={affiliations}
            inputValue={search}
            menuOpen={menuOpen}
            searchableOptions={searchableTags}
            hospitalOptions={hospitalOptions}
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
      </Beforeunload>
    )
  }
}
export default withRouter(Browse)
