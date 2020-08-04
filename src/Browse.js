// @flow
import React, { Component } from 'react'
import { withRouter, type RouterHistory, type Location } from 'react-router-dom'
import { Beforeunload } from 'react-beforeunload'

import AppScreen from './AppScreen'
import SearchInput from './SearchInput'
import { getSearchTags } from './api'
import { makeOptions } from './options'
import { partition } from './utils'

type Props = {|
  location: Location,
  history: RouterHistory,
  getProfiles: Function,
  profileBaseUrl: string,
  DegreeSelect?: Object,
  RoleSpecificResultsView: Object,
|}
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
    const { history, location } = this.props

    if (location.state) {
      this.loadProfilesFromHistory(location.state)
      return
    }

    const { tags, profiles } = await this.loadInitialData()

    const loadedState = {
      results: profiles,
      searchableTags: makeOptions(
        [
          ...tags.clinical_specialties,
          ...tags.professional_interests,
          ...tags.activities,
          ...tags.parts_of_me,
        ].sort()
      ),
      hospitalOptions: makeOptions(tags.hospital_affiliations),
      loading: false,
    }

    this.setState(loadedState)
    history.replace(window.location.pathname, this.state)
  }

  onUnload = () => {
    const { location, history } = this.props

    console.log('Clearing location.state from onUnload reload')
    history.replace(location.pathname, null)
  }

  loadProfilesFromHistory = (state: Object) => {
    this.setState(state, () => {
      window.scrollTo(0, state.scrollY)
    })
  }

  handleSearch = async () => {
    const { history, getProfiles } = this.props

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
    history.replace(window.location.pathname, this.state)
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

  loadInitialData = async (): Promise<{ tags: Object, profiles: Object }> => {
    const { getProfiles } = this.props
    const { page } = this.state
    try {
      const tags = getSearchTags()
      const profiles = getProfiles({ page })

      return { tags: (await tags).tags, profiles: await profiles }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      if (err.status === 401) {
        this.setState({ error: 'You are not logged in. Please log in.' })
      } else {
        this.setState({ error: 'Unable to load profiles. Try again later.' })
      }
      throw err
    }
  }

  render() {
    const { profileBaseUrl, DegreeSelect, RoleSpecificResultsView } = this.props
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
            DegreeSelect={DegreeSelect}
          />
          <div style={{ padding: '1em 0' }}>
            {error || (
              <RoleSpecificResultsView
                queried={queried}
                resetSearch={this.resetSearch}
                loading={loading}
                results={results}
                nextPage={this.nextPage}
                savedState={this.state}
                profileBaseUrl={profileBaseUrl}
              />
            )}
          </div>
        </AppScreen>
      </Beforeunload>
    )
  }
}
export default withRouter(Browse)
