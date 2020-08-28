// @flow
import React from 'react'
import ReactTooltip from 'react-tooltip'
import ProfileResult from './ProfileResult'
import Button from './Button'

function pluralizeResults(length) {
  if (length === 1) {
    return 'result'
  }
  return 'results'
}

export type Props = {
  results: {
    profile_count: number,
    profiles: Array<Object>,
  } | null,
  queried: boolean,
  loading: boolean,
  nextPage: Event => void,
  resetSearch: Event => void,
  savedState: Object,
  profileBaseUrl: string,
  RoleSpecificProfileResult: Object,
}

const ResultsView = ({
  results,
  queried,
  loading,
  nextPage,
  resetSearch,
  savedState,
  profileBaseUrl,
  RoleSpecificProfileResult,
}: Props) => {
  if (results === null) {
    return <p>Loading...</p>
  }

  const nextButton = results.profiles.length < results.profile_count && (
    <Button disabled={loading} onClick={nextPage}>
      Load 20 more
    </Button>
  )

  const scrollToTopButton =
    results.profiles.length > 0 ? (
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
  const profileElements = results.profiles.map(result => (
    <ProfileResult
      key={result.id}
      browseState={savedState}
      result={result}
      profileBaseUrl={profileBaseUrl}
      RoleSpecificProfileResult={RoleSpecificProfileResult}
    />
  ))

  return (
    <div style={{ padding: '1em 0' }}>
      <p>
        Showing {results.profiles.length}{' '}
        {pluralizeResults(results.profiles.length)} of {results.profile_count}.{' '}
        {loading && <span>Loading...</span>}
        {queried && (
          <button type="button" onClick={resetSearch}>
            Clear search
          </button>
        )}
      </p>
      <ReactTooltip id="indicator" place="bottom" />
      <div>{profileElements}</div>
      {navigationButtons}
    </div>
  )
}

export default ResultsView
