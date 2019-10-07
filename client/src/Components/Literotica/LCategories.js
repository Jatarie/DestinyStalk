import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import Axios from 'axios';

class LCategories extends Component {
    constructor(props) {
        super(props);
        this.state = { data: null };
    }

    componentDidMount() {
        Axios.get("/literotica").then(r => this.setState({ data: r.data.data }));
    }

    render() {
        console.log(this.state.data);
        return (<div>
            {this.state.data && this.state.data.map(c =>
                <div><Link to={"/literotica/c/" + c.rawName}>{c.name}</Link></div>
            )}
        </div>
        )
    };
}

export default LCategories;