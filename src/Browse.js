// @flow
import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import { withRouter } from 'react-router-dom'

import ProfileResult from './ProfileResult'
import SearchInput from './SearchInput'
import { getProfiles } from './api'
import Button from './Button'
import AppScreen from './AppScreen'

function pluralizeResults(length) {
  if (length === 1) {
    return 'result'
  }
  return 'results'
}

type Props = Object
type State = Object

class Browse extends Component<Props, State> {
  state = {
    loading: true,
    degrees: [],
    searchTerms: [],
    search: '',
    results: null,
    queried: false,
    error: null,
    page: 1,
  }

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
    const { history } = this.props
    this.setState({ loading: true })

    const { token } = this.props
    const { searchTerms, search, page, results, degrees } = this.state
    const searchArray = search === '' ? [] : [search]
    const query = searchTerms
      .concat(searchArray)
      .join(' ')
      .toLowerCase()

    const newResults = await getProfiles({ token, query, page, degrees })

    if (page > 1) {
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
    this.setState(
      {
        queried: true,
        searchTerms: tags.map(tag => tag.value),
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

  resetSearch = () => {
    this.setState(
      {
        searchTerms: [],
        degrees: [],
        search: '',
        queried: false,
      },
      this.handleSearch
    )
  }

  render() {
    const {
      error,
      loading,
      results,
      page,
      searchTerms,
      search,
      degrees,
      queried,
    } = this.state

    const nextButton = results !== null &&
      results.profiles.length < results.profileCount && (
        <Button
          disabled={loading}
          onClick={() => {
            this.setState({ page: page + 1 }, this.handleSearch)
          }}
        >
          Load 20 more
        </Button>
      )

    const scrollToTopButton =
      results != null && results.length > 0 ? (
        <Button
          onClick={() => {
            window.scrollTo(0, 0)
          }}
        >
          Scroll to top
        </Button>
      ) : null

    const navigationButtons = (
      <div style={{ textAlign: 'center' }}>
        {nextButton} {scrollToTopButton}
      </div>
    )

    const profileElements =
      results !== null
        ? results.profiles.map(result => (
            <ProfileResult
              key={result.id}
              browseState={this.state}
              {...result}
            />
          ))
        : null

    return (
      <AppScreen>
        <SearchInput
          value={searchTerms}
          inputValue={search}
          degrees={degrees}
          onChange={this.handleChange}
          onChangeDegrees={this.handleChangeDegrees}
          onInputChange={this.handleInputChange}
          onSubmit={() => {
            this.setState({ queried: true }, this.handleSearch)
          }}
        />
        <div style={{ padding: '1em 0' }}>
          {(error !== null && error) ||
            (results === null && <p>Loading...</p>) || (
              <div>
                <p>
                  Showing {results.profiles.length}{' '}
                  {pluralizeResults(results.profiles.length)} of{' '}
                  {results.profileCount}. {loading && <span>Loading...</span>}
                  {queried && (
                    <button type="button" onClick={this.resetSearch}>
                      Clear search
                    </button>
                  )}
                </p>
                <ReactTooltip id="indicator" place="bottom" />
                <div>{profileElements}</div>
                {navigationButtons}
              </div>
            )}
        </div>
      </AppScreen>
    )
  }
}
export default withRouter(Browse)
