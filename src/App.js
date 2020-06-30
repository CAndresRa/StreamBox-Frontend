import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Youtube } from './component/Youtube';
import { MainPageComponent } from './component/MainPageComponent';


class App extends Component {
    constructor(props) {
    super(props);
    this.state = {};
    }

    render(){
    const MainPageComponentView = () => <MainPageComponent />;
  const YoutubeView = () => <Youtube />;

    return (
      <Router>
        <div className="App">
          <Route
            exact
            path="/"
            component={MainPageComponentView}
          />
          <Route
            exact
            path="/video"
            component={YoutubeView}
          />
        </div>
      </Router>
    );
  }
}

export default App;
