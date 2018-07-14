import React from "react";
import * as B from "react-bootstrap";
import {remote} from "electron"

const fetch = remote.require('node-fetch')

class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            tip: 'Paste a ESL league link',
            status: 'warning',
            leagueId: null
        }
        this.busy = false;
    }
    handleChange = async(e) => {
        this.setState({value: e.target.value});
        if (!this.busy && e.target.value.length >= 5) {
            this.busy = !this.busy;
            try {
                const res = await fetch(`https://play.eslgaming.com/api/leagues?path=/play${new URL(e.target.value).pathname}&limit.total=2`, {method: 'get'});
                const answ = await res.json();
                console.log(answ);
                switch (Object.keys(answ).length) {
                    case 0:
                        this.setState({status: "warning", tip: "no leagues found"});
                        break;
                    case 1:
                        this.setState({
                            status: "success",
                            tip: `successfully fetched ${answ[Object.keys(answ)[0]].name.full}`,
                            leagueId: Object.keys(answ)[0]
                        });
                        break;
                    default:
                        this.setState({status: "warning", tip: "found more than 1 league, please specify request"});
                        break;
                }
            } catch (err) {
                this.setState({status: "warning", tip: "fetching error occured"});
            }
            this.busy = !this.busy;
        } else {
            this.setState({status: "warning", tip: "processing..."});
        }
    }
    submitLeague = () => {
        !this.state.leagueId || this.props.submitLeague(this.state.leagueId)
    }
    catchEnter = (e) => {
        e.preventDefault();
        this.submitLeague();
    }
    skip = () => {
        this.props.submitLeague(-1);
    }
    render() {
        return (
          <form onSubmit={this.catchEnter}>
            <B.FormGroup
              onSubmit={this.submitLeague}
              controlId="formTournament"
              validationState={this.state.status}
            />
            <B.ControlLabel>Select a ESL league</B.ControlLabel>
            <B.FormControl
              type="text"
              value={this.state.value}
              placeholder="enter a ESL league link"
              onChange={this.handleChange}
            />
            <B.HelpBlock>{this.state.tip}</B.HelpBlock>
            <B.ButtonGroup>
              <B.Button
                disabled={this.state.status !== "success"}
                onClick={this.submitLeague}
                bsStyle={this.state.status}
              >Submit
              </B.Button>
              <B.Button bsStyle="primary" onClick={this.skip}>Skip & Enter manually</B.Button>
            </B.ButtonGroup>
          </form>
        )
    }
}

export default Start;