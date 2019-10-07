import React, { Component } from 'react';
import axios from 'axios';
import Recipe from './Recipe';

class Crafting extends Component {
    constructor(props) {
        super(props)
        this.state = { data: null, collapse: true }
        this.compare = this.compare.bind(this);
    }
    componentDidMount() {
        axios.get("/crafting").then(r => this.setState({ data: r.data.data }));
    }


    compare(a, b) {
        var aName = Object.keys(a)[0];
        var bName = Object.keys(b)[0];
        a = a[aName];
        b = b[bName];
        if (a.vendorMargin < b.vendorMargin) {
            return 1;
        }
        if (a.vendorMargin > b.vendorMargin) {
            return -1;
        }
        return 0;
    }
    compareAuction(a, b) {
        a = a[Object.keys(a)[0]];
        b = b[Object.keys(b)[0]];
        if (a.auctionMargin < b.auctionMargin) {
            return 1;
        }
        if (a.auctionMargin > b.auctionMargin) {
            return -1;
        }
        return 0;
    }



    render() {
        return (
            <div>
                {this.state.data && Object.keys(this.state.data).map(x =>
                    <div className={"recipe"}>
                        {(this.state.data[x]["auctionCostPer"] || this.state.data[x]["matCost"] || this.state.data[x]["craftCost"]) && this.state.data[x].profession != "" &&
                            <Recipe data={this.state.data[x]}></Recipe>}
                    </div>
                )}
            </div>
        )
    }
}

export default Crafting;