import React, { Component } from 'react';
import './Post.css';
import axios from 'axios';


class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            since: null,
            detail: null,
            detailBool: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.timePassed();
    }

    timePassed() {
        var currentTime = new Date();
        var delta = currentTime.getTime() / 1000 - this.state.data.date;
        if (delta < 60) {
            this.setState({ since: parseInt(delta) + " seconds ago" })
        }
        else if (delta < 3600) {
            this.setState({ since: parseInt(delta / 60) + " minutes ago" })
        }
        else if (delta < 3600 * 24) {
            this.setState({ since: parseInt(delta / 3600) + " hours ago" })
        }
        else {
            this.setState({ since: parseInt(delta / (3600 * 24)) + " days ago" })
        }
    }

    GetORDetail() {
        axios.get("/api/OR?timeStamp=" + this.state.data.date).then(response => this.setState({ detail: response.data.data }));
    }

    handleClick() {
        if (this.state.data.type === "Reddit" || this.state.data.type === "Twitter" || this.state.data.type === "Twitch") {
            window.open(this.state.data.link);
        }
        if (this.state.data.type === "OverRustle") {
            if (!this.state.detail) {
                this.GetORDetail();
                this.setState({ detailBool: true });
            }
            else {
                this.setState({ detailBool: !this.state.detailBool });
            }
        }
    }

    render() {
        return (
            <div className={"post" + ' ' + this.state.data.type}>
                <button onClick={() => this.handleClick()}>
                    {this.state.data.text}
                    <div className={"timePassed"}>{this.state.since}</div>
                </button>
                {this.state.detailBool && this.state.detail &&
                    <div className={"ORDetail"}>
                        {this.state.detail.map(x => <div className={"Lines"}>{x}</div>)}
                    </div>
                }
            </div>
        )
    }
}
export default Post;
