import React from "react";
import * as B from "react-bootstrap";
import {remote} from "electron"

class TwitchVote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bot: false,
            oauth: localStorage.oauth,
            channels: localStorage.channels,
            name: this.props.name,
            voteTip: ''
        }
    }
    start = () => {
        const TwitchBot = remote.require('twitch-bot');

        const votesA = new Set();
        const votesB = new Set();

        this.localhost = remote.require('fresh-localhost')();

        this.io = remote.require('socket.io')(this.localhost, {
            path: '/',
            serveClient: false,
            cookie: false,
            pingTimeout: 5000,
            pingInterval: 10000
        });

        this.io.on('connection', () => {
            const pool = new Set([...votesA, ...votesB])
            this.io.emit('message', {
                percent: pool.size ? [Math.round(votesA.size/pool.size*100), Math.round(votesB.size/pool.size*100)] : [50, 50]
            })
        })

        this.localhost.listen(9876);

        this.bot = new TwitchBot({
            username: 'doesntmeananything',
            oauth: localStorage.oauth,
            channels: localStorage.channels.split(',')
        })

        this.bot.on('error', err => {
                console.log(err)
        })

        this.bot.on('message', chatter => {
            if (!(new Set([...votesA, ...votesB]).has(chatter.username))) {                
                const vote4A = ['team1', 'a', 'left', 'blue', '1', '+', 'one', 'first', 'син', 'один', 'перв', 'лев', this.props.title[0]].some(e => chatter.message.toLowerCase().includes(e))
                const vote4B = ['team2', 'b', 'right', 'orange', '2', '-', 'two', 'second','оранж', 'два', 'втор', 'прав', this.props.title[1]].some(e => chatter.message.toLowerCase().includes(e))
                if (vote4A ^ vote4B) {
                    vote4A ? votesA.add(chatter.username) : votesB.add(chatter.username);
                    const pool = new Set([...votesA, ...votesB]);
                    const msg = {
                        percent: [Math.round(votesA.size/pool.size*100), Math.round(votesB.size/pool.size*100)]
                    }
                    this.io.emit('message', msg);
                    this.setState({
                        voteTip: `Team1: ${msg.percent[0]}%, Team2: ${msg.percent[1]}%, Total: ${pool.size}`
                    })
                }
            }
        })
        this.setState({bot: true})
    }
    stop = () => {
        this.bot.close();
        this.io.close();
        this.localhost.close();
        this.setState({bot: false})
    }
    handleChange = (e) => {
        localStorage[e.target.name] = e.target.value.replace(/\ /, '');
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submitConf = () => {
        this.props.pushConf(this.state.name)
    }
    render() {
        return (
          <B.Form>
            <B.FormGroup>
              <B.ControlLabel>Paste Twitch <a
                onClick={() => {require('electron').shell.openExternal('https://twitchapps.com/tmi/')}}
                href="#"
              >token
                                           </a>
              </B.ControlLabel>
              <B.FormControl
                onChange={this.handleChange}
                name="oauth"
                value={this.state.oauth}
              />
            </B.FormGroup>
            <B.FormGroup>
              <B.ControlLabel>Enter comma-separates channels</B.ControlLabel>
              <B.FormControl
                onChange={this.handleChange}
                name="channels"
                value={this.state.channels}
              />
            </B.FormGroup>
            <B.FormGroup>
              <B.ControlLabel>Vote description</B.ControlLabel>
              <B.FormControl
                onInput={this.submitConf}
                onChange={(e)=>{this.handleChange(e), setTimeout(this.submitConf,500)}}
                name="name"
                value={this.state.name}
              />
            </B.FormGroup>
            <B.Button
              bsStyle={this.state.bot
                    ? 'danger'
                    : 'success'}
              onClick={this.state.bot
                    ? this.stop
                    : this.start}
            >{this.state.bot
                        ? 'Stop vote'
                        : 'Start vote'}
            </B.Button>{' '}
            <B.ControlLabel>{this.state.voteTip}</B.ControlLabel>
          </B.Form>
        )
    }
}

export default TwitchVote;