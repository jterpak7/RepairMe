import React from 'react';
import { createBottomTabNavigator } from 'react-navigation'
import BMOpenTicket from './BMOpenTickets'
import BMClosedTicket from './BMClosedTickets'
import TicketImageScreen from '../TicketSubmit/TicketImageScreen'
import { Icon } from 'react-native-elements'
import Hamburger from './HamburgerBM'

export default createBottomTabNavigator(
    {
        OpenTickets: {
            screen: BMOpenTicket,
            navigationOptions : {
                tabBarLabel: 'View Open Tickets',
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="list" type="material" size={25} color={tintColor} />
                )
            },
        },
        CreateTicket: {
            screen: TicketImageScreen,
            navigationOptions: {
                tabBarLabel: 'Submit Ticket',
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="add" type="material" size={25} color={tintColor} />
                )
            }
        },
        ClosedTickets: {
            screen: BMClosedTicket,
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
})
