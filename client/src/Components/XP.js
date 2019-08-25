import React, { Component } from 'react';
import { Scatter } from 'react-chartjs-2';
import Axios from 'axios';

var fs = require('fs');

class XP extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        Axios.get("/graphapi").then(r => this.setState({ data: r.data.data }));
    }

    render() {
        var data = {
            label: "hey",
            datasets: [{
                label: '# of Votes',
                data: this.state.data.plots,
                showLine: true,
            }]
        }

        var options = {
            elements: {
                line: {
                    tension: 0.1
                }
            }
        };


        return (
            <Scatter
                data={data}
                options={options}
            />
        )
    };
}

export default XP;