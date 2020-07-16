import React, {Component} from 'react';
import { Form, Input, Button, Card, CardTitle, CardText, CardBody } from 'reactstrap';
import axios from 'axios';
import SockJs from 'sockjs-client';
import Stomp from 'stompjs';
import '../App.css';

var stompClient = null;

export class ChatComponent extends Component {


  constructor(props){
      super(props);
      this.state = {
          username: 'Client',
          message: '',
          messages: []
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChangeMessage = this.handleChangeMessage.bind(this);
      this.connect = this.connect.bind(this);
  }

  componentDidMount(){
    this.connect();
  }

  connect() {
    //http://localhost:8080
    var socket = new SockJs('https://streamboxback.herokuapp.com/websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        var roomName = window.location.pathname.split("/")[2];
        stompClient.subscribe('/topic/chat.' + roomName, (eventBody) => {
          this.setState(prev => ({
            messages: [...prev.messages, eventBody.body],
          }));
          // this.state.messages.push ... Never do this
        });
    });
  }

  handleSubmit(event){
    event.preventDefault();
    const newMessage = this.state.username + ' dice: ' + this.state.message +" ";
    var roomName = window.location.pathname.split("/")[2];
    var messageToSend = [newMessage, roomName];
    console.log(this.state.message + "SEND THIS CHAT");
    stompClient.send("/app/chat", {}, JSON.stringify(messageToSend));
    this.setState({ message: ''});
    document.getElementById("inputMessages").reset();
  }

  handleChangeMessage(event){
    this.setState({message: event.target.value});
    //console.log(this.state.message + " STATE IN BAR MESSAGE");
  }

  render(){
      return (
        <div >
          <div >
            <br></br>
              <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', width: '-30', height: '600px' }}>
                <CardBody>
                  <CardTitle>StreamBox</CardTitle>
                  <div className="scrollable">
                    <CardText>
                      {this.state.messages.map((message) => (
                        <div>{message}</div>
                        ))}
                    </CardText>
                  </div>
                </CardBody>
              </Card>
              <br></br>
              <div >
              <Form onSubmit={this.handleSubmit} id="inputMessages" >
                <Input type="text" placeholder="Message" bsSize="lg" name="inputMessage" onChange={this.handleChangeMessage} />
                <Button type="submit" className="btn-lg btn-dark btn-block"> send </Button>
              </Form>
              </div>
          </div>
        </div>
      );
  }
}
