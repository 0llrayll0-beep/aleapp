import { registerRootComponent } from 'expo';

import direct from './pages/direct';
import MainPage from './pages/mainpage';
import React from 'react';
import login from './pages/login';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(direct);
