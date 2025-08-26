/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  createStaticNavigation: jest.fn(),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: jest.fn(() => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ children }: any) => children,
  })),
}));

// Mock Redux Persist
jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }: any) => children,
}));

// Mock SafeAreaProvider
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock Redux store
jest.mock('../src/store/store', () => ({
  store: {
    getState: jest.fn(),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  },
  persistor: {
    persist: jest.fn(),
  },
}));

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
