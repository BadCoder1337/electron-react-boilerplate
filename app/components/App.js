import React from "react";
import * as B from "react-bootstrap";
import Preview from "./Preview";
import Start from "./Start";
import Configurator from "./Configurator";
import TwitchVote from "./TwitchVote";
import VoteHud from "./VoteHud"
import {b64EncodeUnicode} from '../api';

const domain = 'https://badcoder1337.github.io'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            linkHud: `${domain  }/hud/hud?c=eyJ0aXRsZSI6WyJURUFNMSIsIlRFQU0yIl0sImx` +
                    `vZ28iOlsiaW1nL2RlZmF1bHQuanBnIiwiaW1nL2RlZmF1bHQuanBnIl0sImVzbCI6MSwic2NvcmUiOls` +
                    `wLDBdLCJuYW1lIjoiVEVTVCBUT1VSTkFNRU5UIn0=`,
            linkVote: `${domain  }/vote/?c=eyJ0aXRsZSI6WyJURUFNMSIsIlRFQU0xIl0sImxvZ` +
                    `28iOlsiaW1nL2RlZmF1bHQuanBnIiwiaW1nL2RlZmF1bHQuanBnIl0sIm5hbWUiOiJWb3RlIGluIGNoY` +
                    `XQifQ==`,
            league: null,
            name: localStorage.channels ? `twitch.tv/${  localStorage.channels.split(',').join(', twitch.tv/')}` : 'Vote in chat',
            title: [
                "TEAM1", "TEAM2"
            ],
            logo: ["img/default.jpg", "img/default.jpg"]
        };
        this.defaultState = this.state;
    }

    submitLeague = id => {
        this.setState({league: id});
        console.log("League ", id, " submited");
    }

    resetState = () => {
        this.setState(this.defaultState);
    }

    updateHudLink = (conf) => {
        this.setState({
            title: conf.title,
            logo: conf.logo,
            linkHud: `${domain  }/hud/hud?c=${b64EncodeUnicode(JSON.stringify(conf))}`,
            linkVote: `${domain  }/vote/?c=${b64EncodeUnicode(JSON.stringify({title: conf.title, logo: conf.logo, name: this.state.name}))}`
        });
    }
    updateVoteLink = (conf) => {
        this.setState({
            name: conf,
            linkVote: `${domain  }/vote/?c=${b64EncodeUnicode(JSON.stringify({title: this.state.title, logo: this.state.logo, name: conf}))}`
        })
    }
    render() {
        switch (this.state.league) {
            case null:
                return (
                  <div className="component-app">
                    <Preview link={this.state.linkHud} />
                    <br />
                    <Start submitLeague={this.submitLeague} />
                  </div>
                )
                // case -1:
            default:
                return (
                  <div className="component-app">
                    <B.Button onClick={this.resetState} bsStyle="danger">Reset</B.Button>
                    <Preview link={this.state.linkHud} />
                    <br />
                    <Configurator
                      pushConf={this.updateHudLink}
                      logo={this.state.logo}
                      title={this.state.title}
                      league={this.state.league}
                    />
                    <br />
                    <TwitchVote
                      title={this.state.title}
                      pushConf={this.updateVoteLink}
                      name={this.state.name}
                    />
                    <br />
                    <VoteHud link={this.state.linkVote} />
                  </div>
                )
        }
    }
}
export default App;
