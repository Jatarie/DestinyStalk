import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import Axios from 'axios';

class LCatStories extends Component {
    constructor(props) {
        super(props);
        this.state = { data: null };
    }

    componentDidMount() {
        Axios.get("/literotica/c/" + this.props.match.params.category).then(r => this.setState({ data: r.data.data }));
    }

    render() {
        console.log(this.state.data);
        return (
            <div>
                {this.state.data && Object.keys(this.state.data).map(x =>
                    <div><Link to={{
                        pathname: "/literotica/s/" + x,
                        state: { author: this.state.data[x] }
                    }}>{x}</Link></div>
                )}
            </div>
        )
    };
}

export default LCatStories;