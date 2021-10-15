import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { FontLoader } from './utils/FontLoader';
import styles from './constants/GlobalStyle';
import { createStackNavigator, createBottomTabNavigator, StackNavigator, createDrawerNavigator, navigationOptions } from 'react-navigation';
import LoginScreen  from './components/SignUpLogin/LoginScreen'
import SignUpScreen from './components/SignUpLogin/SignUpScreen'
import ConnectToAssetQRScreen from './components/SignUpLogin/ConnectToAssetQR'
import ConnectToAssetTenantScreen from './components/SignUpLogin/ConnectToAssetTenant'
import CreateAsset from './components/SignUpLogin/CreateAsset'
import UserSelect from './components/SignUpLogin/UserSelect'
import PaymentSetup from './components/SignUpLogin/PaymentSetup'
import CompletePaymentSetup from './components/SignUpLogin/CompletePaymentSetup'
import StripeView from './components/SignUpLogin/StripeView'
import TicketImageScreen from './components/TicketSubmit/TicketImageScreen'
import BMSubmitTicket from './components/TicketSubmit/BMSubmitTicket'
import BMHome from './components/BM/HamburgerBM'
import TenantHome from './components/Tenant/HamburgerTenant'
import BMTicket from './components/BM/BMTicketDetails'
import BMViewBids from './components/BM/BMViewBids';
import BMSelectBid from './components/BM/BMSelectBid';
import BMCategoryTicket from './components/TicketSubmit/BMCategoryTicket'
import TenantTicket from './components/Tenant/TenantTicketDetails'
import TenantSubmitTicket from './components/TicketSubmit/TenantSubmitTicket'
import SubHome from './components/Sub/HamburgerSub';
import SubOpenTicketDetails from './components/Sub/SubOpenTicketDetails';
import SubCompleteTicket from './components/Sub/SubCompleteTicket';
import SubClosedTicketDetails from './components/Sub/SubClosedTicketDetails';
import SubClosedTickets from './components/Sub/SubClosedTickets'
import SubViewCompletedTicket from './components/Sub/SubViewCompletedTicket';
import SubBid from './components/Sub/SubBidOnTick';
import UpdateInfo from './components/UpdateInfo';
import SubMarektPlace from './components/Sub/SubMarketPlace';
import PlaceHourlyBid from './components/Sub/PlaceHourlyBid';
import PlaceFixBid from './components/Sub/PlaceFixBid';
import Chat from './components/Chat/Chat';
import CreateChat from './components/Chat/CreateChat';
import ChatHome from './components/Chat/ChatHome';
import UserSettingsScreen from './components/UserSettings'
import ChangePasswordScreen from './components/ChangePassword'
import BurgerButton from './components/BurgerButton';
import LogoutConfirmScreen from './components/SignUpLogin/LogoutConfirm'
import BMReviewTicket from './components/BM/BMReviewTicket'

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    SignUp: SignUpScreen,
    UserSelect: UserSelect,
    ConnectToAssetQR: ConnectToAssetQRScreen,
    ConnectToAssetTenant: ConnectToAssetTenantScreen,
    CreateAsset: CreateAsset,
    PaymentSetup: PaymentSetup,
    CompletePaymentSetup: CompletePaymentSetup,
    StripeView: StripeView,
    TicketImage: TicketImageScreen,
    TenantSubmitTicket: TenantSubmitTicket,
    TenantHome: TenantHome,
    TenantTicket: TenantTicket,
    BMSubmitTicket: BMSubmitTicket,
    BMHome: BMHome,
    BMTicket: BMTicket,
    BMViewBids: BMViewBids,
    BMSelectBid: BMSelectBid,
    BMCategoryTicket: BMCategoryTicket,
    SubHome: SubHome,
    SubOpenTicketDetails: SubOpenTicketDetails,
    SubViewCompletedTicket: SubViewCompletedTicket,
    SubCompleteTicket: SubCompleteTicket,
    SubClosedTicketDetails: SubClosedTicketDetails,
    SubClosedTickets: SubClosedTickets,
    BMTicket: BMTicket,
    TenantHome: TenantHome,
    TenantTicket: TenantTicket,
    CreateChat: CreateChat,
    ChatHome: ChatHome,
    UpdateInfo: UpdateInfo,
    SubMarektPlace: SubMarektPlace,
    SubBid: SubBid,
    PlaceHourlyBid: PlaceHourlyBid,
    PlaceFixBid: PlaceFixBid,
    BMViewBids: BMViewBids,
    BMSelectBid: BMSelectBid,
    Chat: Chat,
    UserSettings: UserSettingsScreen,
    ChangePassword: ChangePasswordScreen,
    LogoutConfirm: LogoutConfirmScreen,
    UpdateInfo: UpdateInfo,
    BMReviewTicket: BMReviewTicket,
  },
  {
    initialRouteName: 'Login',
    cardStyle:{
      backgroundColor: styles.white.color
    },
    navigationOptions: {
      backgroundColor: styles.white.color,
      headerStyle:{
        backgroundColor: styles.mainBlue.color
      },
      headerTintColor: styles.white.color,
      headerTitle: (<Image style={{width:80, height:35}} source={require('./assets/logoWhite.png')}/>),
      headerRight: <BurgerButton /> ,
    }
  },
)

export default class App extends React.Component {

  render() {
    console.disableYellowBox = true;
    return (
      <FontLoader>
        <RootStack />
      </FontLoader>
    )
  }
}
