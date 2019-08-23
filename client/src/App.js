import React, { Component } from 'react';
import 'axios';
import Axios from 'axios';
import Post from './Components/Post'
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      filter: null,
      Bools: [1, 1, 1, 1],
      dict: { "Reddit": 0, "Twitch": 1, "Twitter": 2, "OverRustle": 3 },
    };
  }

  componentDidMount() {
    Axios.get("/api")
      .then(r => this.setState({ data: r.data.data }))
  }


  render() {
    return (
      <div className={"posts"}>
        <div className={"FilterButton"}>
          <ul>
            <button onClick={() => this.setState({ Bools: [1, 1, 1, 1] })}>All</button>
            <button onClick={() => this.setState({ Bools: [1, 0, 0, 0] })}>Reddit</button>
            <button onClick={() => this.setState({ Bools: [0, 1, 0, 0] })}>Twitch</button>
            <button onClick={() => this.setState({ Bools: [0, 0, 1, 0] })}>Twitter</button>
            <button onClick={() => this.setState({ Bools: [0, 0, 0, 1] })}>OverRustle</button>
          </ul>
        </div>
        {this.state.data &&
          this.state.data.map(x => {
            if (this.state.Bools[this.state.dict[x.type]]) {
              return <Post data={x} />
            }
          })
        }
      </div>
    );
  }
}
export default App;