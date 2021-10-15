import { createDrawerNavigator } from 'react-navigation'
import TenantHome from './TenantHome';
import ChangePasswordScreen from '../ChangePassword'
import UserSettingsScreen from '../UserSettings'
import LogoutConfirm from '../SignUpLogin/LogoutConfirm'
import ChatHome from '../Chat/ChatHome'

export default createDrawerNavigator(
    {
       Home: {
           screen: TenantHome
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
       },
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