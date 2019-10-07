
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import Axios from 'axios';
import './LStory.css'

class LStory extends Component {
    constructor(props) {
        super(props);
        this.state = { data: null };
    }

    componentDidMount() {
        if (this.props.location.state) {
            Axios.get("/literotica/s/" + this.props.match.params.story + "?author=" + this.props.location.state.author)
                .then(r => this.setState({ data: r.data.data }))
        }
    }

    render() {
        return (
            <div className={"Story"}>
                {this.state.data && this.state.data.map(x =>
                    <div className={"Chapter"}>{x}</div>
                )}
            </div>
        )
    };
}

export default LStory;