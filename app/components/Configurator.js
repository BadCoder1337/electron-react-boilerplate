import React from "react";
import * as B from "react-bootstrap";
import Loading from 'react-loading';
import {remote} from "electron"
import MatchSelector from './MatchSelector';

const fetch = remote.require('node-fetch');

class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            logo: this.props.logo,
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
            const res = await fetch(`https://api.eslgaming.com/play/v1/leagues/${this.props.league}`, {method: 'get'});
            const answ = await res.json();
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
                }}
              >
                <Loading type="spin" color="#000000" />
              </div>
            )
        } 
            return (
              <B.Form onBlur={this.submitConf} onSubmit={this.submitConf}>
                <B.FormGroup>
                  <B.ControlLabel>Tournament Name</B.ControlLabel>
                  <B.FormControl
                    onChange={(e)=>{this.handleChange(e);setTimeout(this.submitConf,500)}}
                    name="name"
                    value={this.state.name}
                    type="text"
                  />
                </B.FormGroup>
                <B.FormGroup>
                  <MatchSelector league={this.props.league} pushMatch={this.updateMatch} />
                </B.FormGroup>
                <B.FormGroup
                  style={{
                        display: "flex"
                    }}
                >
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
                        type="text"
                      />
                    </B.Col>
                    <B.Col sm={4}>
                      <B.ControlLabel>Logo URL</B.ControlLabel>
                      <B.FormControl
                        onChange={this.handleChange}
                        id="0"
                        name="logo"
                        value={this.state.logo[0]}
                        type="text"
                      />
                    </B.Col>
                    <B.Col sm={1}>
                      <B.ControlLabel>Score</B.ControlLabel>
                      <B.FormControl
                        onChange={this.handleChange}
                        id="0"
                        disabled={this.state.bo1}
                        name="score"
                        value={this.state.score[0]}
                        type="text"
                      />
                    </B.Col>
                    <B.Col className="w-100" />
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
                        type="text"
                      />
                    </B.Col>
                    <B.Col sm={4}>
                      <B.ControlLabel>Logo URL</B.ControlLabel>
                      <B.FormControl
                        onChange={this.handleChange}
                        id="1"
                        name="logo"
                        value={this.state.logo[1]}
                        type="text"
                      />
                    </B.Col>
                    <B.Col sm={1}>
                      <B.ControlLabel>Score</B.ControlLabel>
                      <B.FormControl
                        onChange={this.handleChange}
                        id="1"
                        disabled={this.state.bo1}
                        name="score"
                        value={this.state.score[1]}
                        type="text"
                      />
                    </B.Col>
                  </B.Col>
                  <B.Col
                    sm={1}
                    style={{
                            display: "flex"
                        }}
                  >
                    <div
                      style={{
                                marginTop: "auto",
                                marginBottom: "auto"
                            }}
                    >
                      <B.Checkbox
                        name="esl"
                        onChange={(e)=>{this.handleChange(e);setTimeout(this.submitConf,500)}}
                        checked={this.state.esl}
                      >ESL Logo
                      </B.Checkbox>
                      <B.Checkbox
                        name="bo1"
                        onChange={(e)=>{this.handleChange(e);setTimeout(this.submitConf,500)}}
                        checked={this.state.bo1}
                      >BO1
                      </B.Checkbox>
                      <B.Button onClick={this.swap}><B.Glyphicon glyph="refresh" />
                                    Swap
                      </B.Button>
                    </div>

                  </B.Col>
                </B.FormGroup>
              </B.Form>
            )
        
    }
}

export default Configurator;