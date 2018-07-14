import React from "react";
import * as B from "react-bootstrap";
import {remote} from "electron"

const fetch = remote.require('node-fetch')

class MatchSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            list: []
        }
        this.default = "https://cdn.eslgaming.com/play/eslgfx/logos/teams/default.gif";
    }
    componentDidMount = async() => {
        if (this.state.loading && this.props.league !== -1) {
            const res = await fetch(`https://api.eslgaming.com/play/v1/leagues/${this.props.league}/results`, {method: 'get'});
            const answ = await res.json();
            answ.forEach(async(e) => {
                if (e.state !== 'closed' && e.participants[0].id && e.participants[0].id) {
                    const f = await fetch(`https://api.eslgaming.com/play/v1/matches/${e.id}`, {method: 'get'});
                    const j = await f.json();
                    this.setState({
                        list: [
                            ...this.state.list,
                            j
                        ]
                    });
                }
            });
            this.setState({loading: false});
        }
    }
    handleChange = (e) => {
        if (e.target.value === -1) {
            this.props.pushMatch(null, true);
        } else {
        this.state.list.forEach(m => {
                if (m.id == e.target.value) {
                    m.parameters.forEach(p => {
                            if (p.name == "best_of") {
                                this.props.pushMatch({
                                        title: [m.contestants[0].team.name, m.contestants[1].team.name],
                                        logo: [m.contestants[0].team.logo == this.default ? "img/default.jpg" : m.contestants[0].team.logo, m.contestants[1].team.logo == this.default ? "img/default.jpg" : m.contestants[1].team.logo],
                                        bo1: p.selected == 1
                                    })
                            }
                        });
                }
            });}
    }
    render() {
        let first = ""
        if (this.state.loading) {first="Loading..."}
        if (!this.state.loading) {first="Choose match"}
        if (!this.state.loading && !this.state.list.length) {first="No open matches"}
        if (this.props.league == -1) {
            return (null)
        } 
            return (
              <div>
                <B.ControlLabel>Select match</B.ControlLabel>
                <select onChange={this.handleChange} className="form-control">
                  <option value={-1}>{first}</option>
                  {
                            this.state.list.map(e => <option value={e.id} key={e.id}>{`${e.contestants[0].team.name} vs ${e.contestants[1].team.name}`}</option>)
                        }
                </select>
              </div>
            )
        
    }
}

export default MatchSelector