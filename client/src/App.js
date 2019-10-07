import React, { Component } from 'react';
import './App.css';
import XP from './Components/Graph/XP';
import LCategories from './Components/Literotica/LCategories';
import LCatStories from './Components/Literotica/LCatStories';
import LStory from './Components/Literotica/LStory';
import Stalk from './Components/Stalk/Stalk';
import Crafting from './Components/Crafting/Crafting';
import { HashRouter, Route } from 'react-router-dom';


class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <HashRouter>
        <div className={"App"}>
          <div>
            <Route path="/stalk" component={Stalk} />
            <Route path="/graph" component={XP} />
            <Route path="/literotica/c/:category" exact component={LCatStories} />
            <Route path="/literotica/s/:story" exact component={LStory} />
            <Route path="/literotica" exact component={LCategories} />
            <Route path="/crafting" exact component={Crafting} />
          </div>
        </div>
      </HashRouter>
    );
  }
}
export default App;