
import React, { Component } from 'react';
import './Recipe.css';

class Recipe extends Component {
    constructor(props) {
        super(props)
        this.state = { "data": null }
    }

    componentDidMount() {
        this.showMaterials()
    }

    showMaterials() {
        var d = this.props.data;
        var dKeys = Object.keys(this.props.data);
        if (dKeys.includes("materials")) {
            Object.keys(d["materials"]).map(m => {
                if (d["materials"][m]["matCost"] <= d["materials"][m]["craftCost"]) {
                    d["materials"][m]["materials"] = false;
                }
            })
        }
        this.setState({ "data": d })
    }




    render() {
        if (this.state.data != null) {
            // if (this.state.data.name == "Runecloth Bag") {
            // console.log(this.state)
            // }
        }
        return (
            <div className={"recipe"}>
                {this.state.data &&
                    <div>
                        {this.state.data["name"]}
                        <div>
                            Craft Cost: {this.state.data["craftCost"]}
                        </div>
                        <div>
                            Quantity: {this.state.data["quantity"]}
                        </div>
                        <div>
                            Auction Cost: {this.state.data["auctionCostTotal"]}
                        </div>
                        <div>
                            Mat Cost: {this.state.data["matCost"]}
                        </div>
                        <div>
                            Margin: {(this.state.data["auctionCostTotal"] - this.state.data["craftCost"]) / this.state.data["quantity"]}
                        </div>
                        {Object.keys(this.state.data).includes("materials") && Object.keys(this.state.data.materials).map(x => this.state.data["materials"][x] && <Recipe data={this.state.data["materials"][x]}></Recipe>)}
                    </div>
                }
            </div>
        )
    }
}

export default Recipe;