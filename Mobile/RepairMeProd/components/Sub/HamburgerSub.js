import { createDrawerNavigator } from 'react-navigation'
import SubHome from './SubHome';
import ChangePasswordScreen from '../ChangePassword'
import UserSettingsScreen from '../UserSettings'
import LogoutConfirm from '../SignUpLogin/LogoutConfirm'
import ChatHome from '../Chat/ChatHome'
import styles from '../../constants/GlobalStyle'

export default createDrawerNavigator(
    {
       Home: {
            screen: SubHome
       },
       Messages: {
            screen: ChatHome,
       },
       Settings: {
            screen: UserSettingsScreen
       },
       ChangePassword: {
            screen: ChangePasswordScreen,
            navigationOptions: {
               title: 'Change Password'
            }
       },
       Logout: {
            screen: LogoutConfirm
       }
    },
    {
        drawerPosition: 'right',
        contentOptions: {
          activeTintColor :styles.mainBlue.color,
           inactiveTintColor :styles.mainGrey.color,

          activeBackgroundColor :styles.greyBack.color,
          inactiveBackgroundColor :styles.white.color
        }
    }
)