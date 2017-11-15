/*  global __DEV__ */
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';

export default (initialState = {}, rootReducer) => {
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

  // const rootReducer = getRootReducer()
  const store = createStore(rootReducer, initialState, enhancer);


  // if (module.hot) {
  //   module.hot.accept(() => {
  //     const nextRootReducer = require('../redux/root-reducer.js').default;
  //     store.replaceReducer(nextRootReducer);
  //   });
  // }

  return store;
};
