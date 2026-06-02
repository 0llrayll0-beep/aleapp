//define a navegação entre Login e Home

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LoginScreen from './login';
import MainPage from './mainpage';
import CadastroScreen from './Cadastro';
import SobreScreen from './Sobre';

// Tipagem das rotas (evitar aquele erro chato de navigate(passei raova para carai sksk achei no stack overflow ))
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Cadastro: undefined;
  Sobre: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} // sem header nativo ambas as telas têm o próprio header(impedir que fique bizarroso)
      >
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home"  component={MainPage}   />
        <Stack.Screen name="Sobre" component={SobreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}