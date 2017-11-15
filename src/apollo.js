/*  global __DEV__ */
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { AsyncStorage } from 'react-native';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';

export default ({ config }) => {
  const apolloConfig = config.apollo
  const uri = __DEV__ ? apolloConfig.developmentUrl : apolloConfig.productionUrl

  const cache = new InMemoryCache()

  const withToken = setContext(async () => {
    const token = await AsyncStorage.getItem('token')
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  });

  const errorLink = onError(({ networkError }) => {
    if (networkError && networkError.statusCode === 401) {
      //  TODO
      console.log('Logout!')
    }
  })

  const httpLink = createHttpLink({
    uri,
  });

  const link = withToken.concat(errorLink).concat(httpLink)

  return new ApolloClient({
    link,
    cache,
  })
};
