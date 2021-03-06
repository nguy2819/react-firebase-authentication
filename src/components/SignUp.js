import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { base } from '../configuration/firebase'
import { doCreateUserWithEmailAndPassword } from '../configuration/firebase/index'
import * as routes from '../constants/routes'

const SignUpPage = ({ history }) =>
  <div>
    <h1>SignUp</h1>
    <SignUpForm history={history} />
  </div>

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
})

class SignUpForm extends Component {
  onSubmit = async (event) => {
    event.preventDefault()
    const {
      username,
      email,
      passwordOne,
    } = this.state

    const {
      history,
    } = this.props

    const authUser = await doCreateUserWithEmailAndPassword(email, passwordOne)
    const newUser = await base.post(`users/${authUser.user.uid}`, {
        data: { email, username }
      }
    )

    console.log(newUser)
    this.setState({ ...INITIAL_STATE })
    history.push(routes.HOME)

    // .then(authUser => {
    //
    //   // Create a user in your own accessible Firebase Database too
    //   db.doCreateUser(authUser.user.uid, username, email)
    //     .then(() => {
    //       this.setState({ ...INITIAL_STATE })
    //       history.push(routes.HOME)
    //     })
    //     .catch(error => {
    //       this.setState(byPropKey('error', error))
    //     })
    //
    // })
    // .catch(error => {
    //   this.setState(byPropKey('error', error))
    // })


  }

  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={username}
          onChange={event => this.setState(byPropKey('username', event.target.value))}
          type="text"
          placeholder="Full Name"
        />
        <input
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <input
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <input
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage)

export {
  SignUpForm,
  SignUpLink,
}
