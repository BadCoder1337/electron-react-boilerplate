import React from "react";
import * as B from "react-bootstrap";

class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tip: "Click to copy"
        }
    }
    copy = () => {
        this.setState({tip: "Copied"});
        document.getElementById("copy1").select();
        document.execCommand("copy");
        setTimeout(()=>{this.setState({tip: "Click to copy"})}, 3000);
    }
    render() {
        const tooltip = (
          <B.Tooltip id="tooltip1">
            {this.state.tip}
          </B.Tooltip>
        )
        return (
          <div>
            <h3>Preview</h3>
            <iframe
              style={{height: '120px'}}
              className="preview"
              title="Preview"
              src={`${this.props.link}&f=1`}
              scrolling="no"
            />
            <h4>Hud (1920x120)</h4>
            <B.OverlayTrigger placement="top" overlay={tooltip}>
              <B.FormControl id="copy1" onClick={this.copy} type="text" value={this.props.link} readOnly />
            </B.OverlayTrigger>
          </div>
        )
    }
}

export default Preview;