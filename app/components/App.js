import React from "react";
import * as B from "react-bootstrap";
import Preview from "./Preview";
import Start from "./Start";
import Configurator from "./Configurator";
import {b64EncodeUnicode} from '../api';
import "./App.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            link: 'https://badcoder1337.github.io/hud/hud?c=eyJ0aXRsZSI6WyJURUFNMSIsIlRFQU0yIl0sImxvZ28iOl' +
                    'siaW1nL2RlZmF1bHQuanBnIiwiaW1nL2RlZmF1bHQuanBnIl0sImVzbCI6MSwic2NvcmUiOlswLDBdLC' +
                    'JuYW1lIjoiVEVTVCBUT1VSTkFNRU5UIn0=',
            league: null
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

    updateLink = (conf) => {
      this.setState({link: `https://badcoder1337.github.io/hud/hud?c=${b64EncodeUnicode(JSON.stringify(conf))}`});
    }

    render() {
        switch (this.state.league) {
            case null:
                return (
                    <div className="component-app">
                        <Preview link={this.state.link}/>
                        <br/>
                        <Start submitLeague={this.submitLeague}/>
                        <br/>
                        <B.Button onClick={this.resetState} disabled bsStyle="info">Reset</B.Button>
                    </div>
                )
                //case -1:
            default:
                return (
                    <div className="component-app">
                        <Preview link={this.state.link}/>
                        <br/>
                        <Configurator pushConf={this.updateLink} league={this.state.league}/>
                        <br/>
                        <B.Button onClick={this.resetState} bsStyle="danger">Reset</B.Button>
                    </div>
                )
        }
    }
}
export default App;
