import React, {Component} from 'react';
import { createAppContainer } from "react-navigation";
import Navigator from './Navigator';
import {GoogleSignin} from 'react-native-google-signin';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import ReduxThunk from 'redux-thunk';
import {Provider} from 'react-redux';
import logger from 'redux-logger'

import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Remote debugger"]);

const AppContainer = createAppContainer(Navigator);

class App extends Component {
  componentWillMount() {
    GoogleSignin.configure({
      webClientId: '217407860699-qeprm9tf6v0pk37irmlcrr09jbf5vuu3.apps.googleusercontent.com'
    })
  }
  
  render() {
    const store = createStore(reducers, applyMiddleware(ReduxThunk, logger));

    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )
  }
}

export default App;