import React from "react";
import * as B from "react-bootstrap";

const domain = 'http://localhost:8080'

class TournamentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            linkHud: `${domain}/hud/hud?title=TEAM1%2CTEAM2&logo=img%2Fdefault.jpg%2Cimg%2Fdefault.jpg&esl=1&name=TEST%20TOURNAMENT&score=0%2C0`,
            linkVote: `${domain}/vote/?title=TEAM1%2CTEAM2&logo=img%2Fdefault.jpg%2Cimg%2Fdefault.jpg&name=Vote%20Fin%20chat`,
            league: null,
            name: localStorage.channels ? `twitch.tv/${localStorage.channels.split(',').join(', twitch.tv/')}` : 'Vote in chat',
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
            linkHud: `${domain}/hud/hud?${Object.entries(conf).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&')}`,
            linkVote: `${domain}/vote/?${Object.entries({title: conf.title, logo: conf.logo, name: this.state.name}).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&')}`
        });
    }
    updateVoteLink = (conf) => {
        this.setState({
            name: conf,
            linkVote: `${domain}/vote/?${Object.entries({title: this.state.title, logo: this.state.logo, name: conf}).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&')}}`
        })
    }
    render() {
        // switch (this.state.league) {
        //     case null:
                return (
                  <div>
                    <Preview link={this.state.linkHud} />
                    <br />
                    <Start submitLeague={this.submitLeague} />
                  </div>
                )
        // }
    }
}
export default TournamentPage;