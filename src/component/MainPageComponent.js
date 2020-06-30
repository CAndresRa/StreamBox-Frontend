import React, {Component} from 'react';
import '../App.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

export class MainPageComponent extends Component {

  constructor(props){
    super(props)
    this.state = {
      userName : '',
      roomName : ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangeRoomName = this.handleChangeRoomName.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("click");
  }

  handleChangeUsername(event){
    this.setState({ userName: event.target.value});
    console.log(this.state.userName);
  }

  handleChangeRoomName(event){
    this.setState({roomName: event.target.value});
    console.log(this.state.roomName);
  }

  render(){
    return(
      <div className="login-form">
        <h1>
          <span className="font-weight-bold text-center text-white">StreamBox</span>
        </h1>
        <h3 className="text-center text-white">Crear Sala</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label className="text-white">Nombre</Label>
            <Input type="text" placeholder="Nombre" name="name" onChange={this.handleChangeUsername}/>
          </FormGroup>
          <FormGroup>
            <Label className="text-white">Room</Label>
            <Input type="text" placeholder="IdRoom" name="roomName" onChange={this.handleChangeRoomName}/>
          </FormGroup>
          <Button type="submit" className="btn-lg btn-dark btn-block"> Unirse </Button>
        </Form>
      </div>
    );
  }

}
