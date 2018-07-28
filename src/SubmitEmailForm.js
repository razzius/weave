import React, { Component } from 'react'

export default class SubmitEmailForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      error: null
    }
  }

  submitEmail = e => {
    e.preventDefault()
    this.props.sendEmail(this.state.email)
      .then(() => {
        this.props.history.push(this.props.redirectTo)
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  updateEmail = e => {
    this.setState({ email: e.target.value })
  }

  render() {
    return <form onSubmit={this.submitEmail}>
      <p>
        <input name="email" type="email" onChange={this.updateEmail} />
      </p>
    {this.state.error && <p>
     There was a problem with the request. Please wait a moment and try again.
     </p>}
    <button className="button">Send verification email</button>
    </form>
  }
}
