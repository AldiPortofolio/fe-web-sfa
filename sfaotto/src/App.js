import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import DefaultLayout from './components/DefaultLayout'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/" component={DefaultLayout} />
        </Switch>
      </Router>
    );
  }
}

export default App;
