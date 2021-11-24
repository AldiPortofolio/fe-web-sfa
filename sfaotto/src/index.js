import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux'
import ReduxPromise from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import persistState from 'redux-localstorage'

import reducers from './reducers';

import './css/bootstrap.min.css';
import './css/line-awesome.min.css';
import './css/main.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import { unregister as unregisterServiceWorker } from './registerServiceWorker'

const middlewares = [ReduxPromise, thunkMiddleware]

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger')
  middlewares.push(logger)
}

const enhancer = compose(
  applyMiddleware(...middlewares),
  persistState('auth', { key: 'AUTH' })
)

const store = createStore(reducers, {}, enhancer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));
// registerServiceWorker();
unregisterServiceWorker();
