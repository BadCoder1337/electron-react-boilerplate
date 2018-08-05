import React from 'react';
import {createHashHistory} from 'history';
import global from 'react-global-storage';
import Navbar from './Navbar';

export default class Root extends React.Component {
    constructor(props) {
        super(props)
        global.setState('dark', localStorage['dark']);
        global.setState('discord_status', {msg: 'Fetching profile...', connected: false});
        global.setState('locale', navigator.language.split('-')[0])
    }

    render() {
        return (<Navbar history={createHashHistory()}/>)
    }
}