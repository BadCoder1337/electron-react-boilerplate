import React from "react";
import * as B from "react-bootstrap";
import Loading from 'react-loading';
import MatchSelector from './MatchSelector';

const remote = require('electron').remote;

const fetch = remote.require('node-fetch');

const TwitchBot = remote.require('twitch-bot');

const localhost = remote.require('http').createServer();

const socket = remote.require('socket.io')(localhost, {
    path: '/',
    serveClient: false,
    cookie: false,
    pingTimeout: 5000,
    pingInterval: 10000
});

console.log(socket);

localhost.listen(9876)

const Bot = new TwitchBot({
    username: 'doesntmeananything',
    oauth: 'oauth:rx9x2uepvrciy50lypafjlw4fer249',
    channels: ['fazebook']
  })

Bot.on('join', channel => {
  console.log(`Joined channel: ${channel}`)
})

Bot.on('error', err => {
  console.log(err)
})

Bot.on('message', chatter => {
    console.log(chatter);
    socket.emit('message', chatter);
  if(chatter.message === '!test') {
    Bot.say('Command executed! PogChamp')
  }
})

class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: [
                "TEAM1", "TEAM2"
            ],
            logo: [
                "img/default.jpg", "img/default.jpg"
            ],
            score: [
                0, 0
            ],
            esl: true,
            name: "TEST TOURNAMENT",
            bo1: false,
            loading: this.props.league !== -1
        }
        this.defaultState = this.state;
    }
    componentDidMount = async() => {
        if (this.state.loading) {
            let res = await fetch(`https://api.eslgaming.com/play/v1/leagues/${this.props.league}`, {method: 'get'});
            let answ = await res.json();
            this.league = answ;
            this.setState({loading: false, name: answ.name.full});
            this.submitConf();
        }
    }
    submitConf = (e) => {
        if (e) {e.preventDefault()}
        this.props.pushConf({
                title: this.state.title,
                logo: this.state.logo,
                esl: this.state.esl
                    ? 1
                    : 0,
                name: this.state.name,
                score: this.state.bo1
                    ? ['', '']
                    : this.state.score
            });
    }
    updateMatch = (match, reset) => {
        if (reset) {
            this.setState({
                title: this.defaultState.title,
                logo: this.defaultState.logo,
                bo1: this.defaultState.bo1
            });
        } else {
            this.setState({
                title: match.title,
                logo: match.logo,
                bo1: match.bo1
            })
        }
        console.log("Select ", match);
        setTimeout(this.submitConf, 500)
    }
    editArray = (a, i, v) => {;
        a[i] = v;
        return a;
    }
    swap = () => {
        this.setState({
            title: this.state.title.reverse(),
            logo: this.state.logo.reverse(),
            score: this.state.score.reverse()
        })
        this.submitConf();
    }
    handleChange = (e) => {
        if (e.target.type === "checkbox") {
            this.setState({
                [e.target.name]: !this.state[e.target.name]
            });
            return
        }
        Array.isArray(this.state[e.target.name])
            ? this.setState({
                [e.target.name]: this.editArray(this.state[e.target.name], e.target.id, e.target.value)
            })
            : this.setState({
                [e.target.name]: e.target.value
            });

    }
    render() {
        if (this.loading) {
            return (
                <div style={{
                    margin: "3% auto 3% auto"
                }}>
                    <Loading type="spin" color="#000000"/>
                </div>
            )
        } else {
            return (
                <B.Form onBlur={this.submitConf} onInput={this.submitConf} onSubmit={this.submitConf}>
                    <B.ControlLabel>Tournament Name</B.ControlLabel>
                    <B.FormControl
                        onChange={this.handleChange}
                        name="name"
                        value={this.state.name}
                        type="text"/>
                    <MatchSelector league={this.props.league} pushMatch={this.updateMatch}/>
                    <br/>
                    <B.FormGroup
                        style={{
                        display: "flex"
                    }}>
                        <B.Col sm={11}>
                            <B.Col sm={3}>
                                <B.ControlLabel>Team1 (Blue)</B.ControlLabel>
                            </B.Col>
                            <B.Col sm={4}>
                                <B.ControlLabel>Title</B.ControlLabel>
                                <B.FormControl
                                    onChange={this.handleChange}
                                    id="0"
                                    name="title"
                                    value={this.state.title[0]}
                                    type="text"/>
                            </B.Col>
                            <B.Col sm={4}>
                                <B.ControlLabel>Logo URL</B.ControlLabel>
                                <B.FormControl
                                    onChange={this.handleChange}
                                    id="0"
                                    name="logo"
                                    value={this.state.logo[0]}
                                    type="text"/>
                            </B.Col>
                            <B.Col sm={1}>
                                <B.ControlLabel>Score</B.ControlLabel>
                                <B.FormControl
                                    onChange={this.handleChange}
                                    id="0"
                                    disabled={this.state.bo1}
                                    name="score"
                                    value={this.state.score[0]}
                                    type="text"/>
                            </B.Col>
                            <B.Col className={"w-100"}></B.Col>
                            <B.Col sm={3}>
                                <B.ControlLabel>Team2 (Orange)</B.ControlLabel>
                            </B.Col>
                            <B.Col sm={4}>
                                <B.ControlLabel>Title</B.ControlLabel>
                                <B.FormControl
                                    onChange={this.handleChange}
                                    id="1"
                                    name="title"
                                    value={this.state.title[1]}
                                    type="text"/>
                            </B.Col>
                            <B.Col sm={4}>
                                <B.ControlLabel>Logo URL</B.ControlLabel>
                                <B.FormControl
                                    onChange={this.handleChange}
                                    id="1"
                                    name="logo"
                                    value={this.state.logo[1]}
                                    type="text"/>
                            </B.Col>
                            <B.Col sm={1}>
                                <B.ControlLabel>Score</B.ControlLabel>
                                <B.FormControl
                                    onChange={this.handleChange}
                                    id="1"
                                    disabled={this.state.bo1}
                                    name="score"
                                    value={this.state.score[1]}
                                    type="text"/>
                            </B.Col>
                        </B.Col>
                        <B.Col
                            sm={1}
                            style={{
                            display: "flex"
                        }}>
                            <div
                                style={{
                                marginTop: "auto",
                                marginBottom: "auto"
                            }}>
                                <B.Checkbox
                                    name="esl"
                                    onChange={(e)=>{this.handleChange(e);setTimeout(this.submitConf,500)}}
                                    checked={this.state.esl}>ESL Logo</B.Checkbox>
                                <B.Checkbox
                                    name="bo1"
                                    onChange={(e)=>{this.handleChange(e);setTimeout(this.submitConf,500)}}
                                    checked={this.state.bo1}>BO1</B.Checkbox>
                                <B.Button onClick={this.swap}><B.Glyphicon glyph="refresh"/>
                                    Swap</B.Button>
                            </div>

                        </B.Col>
                    </B.FormGroup>
                </B.Form>
            )
        }
    }
}

export default Configurator;