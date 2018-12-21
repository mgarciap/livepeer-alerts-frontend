import React, { Component } from 'react'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { HomeComponent, AccountSummaryComponent } from './Components'
import { PrivateRoute } from './Components/Common/Hoc/PrivateRoute/PrivateRoute'
import withWeb3Provider from './Components/Common/Hoc/Web3Provider/Web3Provider'
import Spinner from './Components/Common/UI/Spinner/Spinner'

export class App extends Component {
  render() {
    console.log('[App.js] props', this.props)
    let content = <Spinner />
    if (this.props.render) {
      content = (
        <Route
          exact
          path="/"
          render={routeProps => <HomeComponent {...this.props} {...routeProps} />}
        />
      )
    }
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            {content}
            <PrivateRoute
              authenticated={this.props.authenticated}
              exact
              path="/account"
              component={AccountSummaryComponent}
            />
          </header>
        </div>
      </Router>
    )
  }
}

export default withWeb3Provider(App)
