import React, {Component} from 'react';
import '../App.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Logo from '../Picture1.png';

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
    const { history } = this.props;
    history.push({
      pathname: '/room/' + this.state.roomName,
      userName: this.state.userName,
    });
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
          <img src={Logo} />
          <span className="font-weight-bold text-center text-white">StreamBox</span>
        </h1>
        <h3 className="text-center text-white">Create / Join a Room</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label className="text-white">Nickname</Label>
          <Input type="text" placeholder="Your Name or Nickname" name="name" required="true" onChange={this.handleChangeUsername}/>
          </FormGroup>
          <FormGroup>
            <Label className="text-white">Room</Label>
          <Input type="text" placeholder="Name of the room you create or join" name="roomName" required="true" onChange={this.handleChangeRoomName}/>
          </FormGroup>
          <Button type="submit" className="btn-lg btn-dark btn-block"> Join </Button>
        </Form>
      </div>
    );
  }

}
