import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Youtube } from './component/Youtube';
import { MainPageComponent } from './component/MainPageComponent';
import { Room } from './component/Room';


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
        <Switch>
          <Route path="/" exact={true} component = {MainPageComponent}/>
          <Route path="/room/:id" exact={true} component={Room} />
        </Switch>
      </Router>
    );
  }
}

export default App;
