/*  global __DEV__ */
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import Reactotron from 'reactotron-react-native';

export default (initialState = {}, getRootReducer) => {
  const loggerMiddleware = createLogger();
  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const middlewares = [
    thunk.withExtraArgument(),
    __DEV__ && loggerMiddleware,
  ]

  const enhancer = composeWithDevTools(
    applyMiddleware(...middlewares.filter(Boolean)),
  );

  const store = Reactotron.createStore(getRootReducer(), initialState, enhancer);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = getRootReducer()
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
