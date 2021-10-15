import React from 'react';
import { createBottomTabNavigator } from 'react-navigation'
import SubMarketPlace from './SubMarketPlace';
import SubOpenTickets from './SubOpenTickets'
import SubClosedTickets from './SubClosedTickets'
import { Icon } from 'react-native-elements'


export default createBottomTabNavigator(
    {
        OpenTickets: {
            screen: SubOpenTickets,
            navigationOptions : {
                tabBarLabel: 'View Open Tickets',
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="list" type="material" size={25} color={tintColor} />
                )
            },
        },
        Marketplace: {
            screen: SubMarketPlace,
            navigationOptions: {
                tabBarLabel: 'View Marketplace',
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="store" type="material" size={25} color={tintColor} />
                )
            }
        },
        ClosedTickets: {
            screen: SubClosedTickets,
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

