import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Card, CardTitle, CardText, CardBody, InputGroup, InputGroupAddon  } from 'reactstrap';
import axios from 'axios';
import SockJs from 'sockjs-client';
import Stomp from 'stompjs';
import '../App.css';

var stompClient = null;
var name = null;

export class ChatComponent extends Component {
  chatContainer = React.createRef();
  constructor(props){
      super(props);
      if(props.username !== undefined){
        var name = props.username;
      }else{
        var name = 'Anónimo';
      }

      this.state = {
          username: name,
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
    //Connect client to endpoint chat
    //http://localhost:8080
    //https://streamboxback.herokuapp.com
    var socket = new SockJs('https://streamboxback.herokuapp.com/websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        var roomName = window.location.pathname.split("/")[2];
        stompClient.subscribe('/topic/chat.' + roomName, (eventBody) => {
          this.setState(prev => ({
            messages: [...prev.messages, eventBody.body],
          }));
          this.scrollToMyRef();
        });
    });
  }

  handleSubmit(event){
    //Send messages to broadcast in backend
    event.preventDefault();
    if(this.state.message !== ""){
        const newMessage = this.state.username + ' : ' + this.state.message +" ";
        var roomName = window.location.pathname.split("/")[2];
        var messageToSend = [newMessage, roomName];
        console.log(this.state.message + "SEND THIS CHAT");
        stompClient.send("/app/chat", {}, JSON.stringify(messageToSend));
        this.setState({ message: ''});
      }
      document.getElementById("inputMessages").reset();
  }

  handleChangeMessage(event){
    this.setState({message: event.target.value});
    //console.log(this.state.message + " STATE IN BAR MESSAGE");
  }

  scrollToMyRef(){
  const scroll =
    this.chatContainer.current.scrollHeight -
    this.chatContainer.current.clientHeight;
  this.chatContainer.current.scrollTo(0, scroll);
  }

  render(){
      return (
        <div >
          <div >
            <br></br>
          <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333', width: '-30', height: '670px' }}>
                <CardBody>
                  <CardTitle>StreamBox - Room {window.location.pathname.split("/")[2]} </CardTitle>
                  <div ref={this.chatContainer} className="scrollable">
                    <CardText>
                      {this.state.messages.map((message) => (
                        <div>{message}</div>
                        ))}
                    </CardText>
                  </div>
                </CardBody>
                <br></br>
                <div>
                <Form onSubmit={this.handleSubmit} id="inputMessages" >
                  <InputGroup>
                    <Input type="text" required="true" placeholder="Message" bsSize="lg" name="inputMessage" onChange={this.handleChangeMessage}/>
                  <InputGroupAddon addonType="prepend" ><Button type="submit" className="btn-lg btn-dark btn-block"> send </Button></InputGroupAddon>
                  </InputGroup>
                </Form>
                </div>
              </Card>
          </div>
        </div>
      );
  }
}
