import { View, Text } from 'react-native'
import React from 'react'

const Refresh = () => {

    const onRefresh = () => {
        setRefreshing(true);

        // Simulate data reload
        setTimeout(() => {
            // your data loading logic here
            setRefreshing(false);
        }, 2000);
    };

}
export default Refresh