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
        console.log(this.state);
        var data = {
            datasets: [{
                label: 'hey',
                data: this.state.data,
                showLine: true,
                borderColor: 'rgba(255, 0, 0, 0.5)',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
            }]
        }

        var options = {
            legend: { display: false },
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