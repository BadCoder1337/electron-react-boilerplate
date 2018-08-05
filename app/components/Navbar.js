/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import {Switch, Link, Router, Route} from 'react-router-dom';
import * as B from 'react-bootstrap';
import global from 'react-global-storage';
import electon from 'electron';

import App from './App';

const fetch = electon.remote.require('node-fetch');

const Test = () => (
    <h1>TEST {global.state.test}</h1>
)

class Navbar extends React.Component {
    toggleTheme = () => {
        localStorage['dark'] = !global.state.dark;
        global.setState('dark', !global.state.dark, this);
    }

    validateUser = async () => {
        try {
            const res = await fetch('https://discordapp.com/api/v6/users/@me', { headers: { 'Authorization': 'Bearer ' + localStorage['discord_oauth'] }});
            const answ = await res.json();
            if (answ.code == 0) {throw new Error()}
            global.setState('discord_status', {msg: `Welcome ${answ.username}#${answ.discriminator}`, id: answ.id, connected: true}, this);
            global.setState('locale', answ.locale, this);
        } catch (err) {
            global.setState('discord_status', {msg: `Connect Discord`}, this);
        }
    }

    componentDidMount = () => {
        this.validateUser();
    }

    discordConnect = async() => {
        if (global.state.discord_status.processing) {return}
        global.setState('discord_status', {msg: `Connecting...`, processing: true}, this);
        const authWindow = new electon.remote.BrowserWindow({
            width: 500,
            height: 600,
            show: false,
            webPreferences: {
                nodeIntegration: false,
                webSecurity: false,
                allowRunningInsecureContent: true   
            }
          })

        let redirect_uri = 'http://localhost:5000/api/auth';
        let authURL = `https://discordapp.com/oauth2/authorize?client_id=431032336692543488&response_type=code&scope=identify&redirect_uri=${encodeURIComponent(redirect_uri)}`;
          
        let handleNav = async (url) => {
            if (url.includes(redirect_uri)) {
                authWindow.close();
                let f = await fetch(url);
                localStorage['discord_oauth'] = await f.text();
                this.validateUser();
            }
        }

        authWindow.on('closed', () => {
            global.setState('discord_status', {msg: `Connect Discord`}, this);
        })

        authWindow.webContents.on('will-navigate', (event, url) => {
            handleNav(url)
        })
      
        authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
            handleNav(newUrl)
        })

        authWindow.once('ready-to-show', () => {
            authWindow.setMenu(null);
            authWindow.show();
        })

        authWindow.loadURL(authURL);
    }

    discordDisconnect = () => {
        global.setState('discord_status', {msg: `Connect Discord`}, this);
        localStorage.removeItem('discord_oauth');
    }

    render() {
        return (
            <Router history={this.props.history}>
                <div id={123}>
                    <B.Navbar collapseOnSelect inverse={!global.state.dark /* bootstrap cosmo glitch */}>
                        <B.Navbar.Header>
                            <B.Navbar.Brand>
                                <Link to="/">Stream HUD Configurator</Link>
                            </B.Navbar.Brand>
                            <B.Navbar.Toggle/>
                        </B.Navbar.Header>
                        <B.Navbar.Collapse>
                            <B.Nav>
                                <B.NavItem href="#/counter">
                                    Tournament
                                </B.NavItem>
                                <B.NavItem href="#/counter">
                                    Counter
                                </B.NavItem>
                            </B.Nav>
                            <B.Nav pullRight>
                                <B.NavItem onClick={this.toggleTheme}>
                                    {global.state.dark
                                        ? '🌙 Dark'
                                        : '☀️ Bright'}
                                </B.NavItem>
                                <B.NavItem onClick={global.state.discord_status.connected ? this.discordDisconnect : this.discordConnect} href="#/counter">
                                    {global.state.discord_status.msg}
                                </B.NavItem>
                            </B.Nav>
                        </B.Navbar.Collapse>
                    </B.Navbar>
                    <div className="container-fluid">
                    <Switch>
                        <Route path="/counter" component={Test}/>
                        <Route path="/" component={App}/>
                    </Switch>
                    </div>
                </div>
            </Router>
        );
    }

}

export default Navbar;