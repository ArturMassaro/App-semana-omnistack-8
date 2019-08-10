import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import login from './pages/login'
import Main from './pages/Main'

export default createAppContainer(
    createSwitchNavigator({
        login,
        Main
    }),
    
);