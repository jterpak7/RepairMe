import React from 'react';
import { createBottomTabNavigator } from 'react-navigation'
import TenantOpenTicket from './TenantOpenTickets'
import TenantClosedTicket from './TenantClosedTickets'
import TicketImageScreen from '../TicketSubmit/TicketImageScreen'
import { Icon } from 'react-native-elements';
import styles from '../../constants/GlobalStyle'

export default createBottomTabNavigator(
    {
        OpenTickets: {
            screen: TenantOpenTicket,
            navigationOptions: {
                tabBarLabel: "View Open Tickets",
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="list" type="material" size={25} color={tintColor} />
                )
            }
        },
        NewTicket: {
            screen: TicketImageScreen,
            navigationOptions: {
                tabBarLabel: "New Ticket",
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="add" type="material" size={25} color={tintColor} />
                )
            }
        },
        ClosedTickets: {
            screen: TenantClosedTicket,
            navigationOptions: {
                tabBarLabel: "View Closed Tickets",
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="done" type="material" size={25} color={tintColor} />
                )
            }
        }
    },
    {
        tabBarOptions: {
            activeTintColor: styles.mainBlue.color,
            inactiveTintColor: styles.smallWhiteText.color,
            inactiveBackgroundColor: styles.mainBlue.color
        },
    },
)
