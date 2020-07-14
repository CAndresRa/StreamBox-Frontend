import React, {Component} from 'react';
import YouTube from 'react-youtube';
import { Form, Input, Button } from 'reactstrap';
import axios from 'axios';
import SockJs from 'sockjs-client';
import Stomp from 'stompjs';

var stompClient = null;

export class Youtube extends Component {

  constructor(props){
    super(props)
    this.state = {
      videoId : '',
    }
    this.handleChangeVideoId = this.handleChangeVideoId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.connect = this.connect.bind(this);
    this.getCurrentTime = this.getCurrentTime.bind(this);

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
        stompClient.subscribe('/topic/video.' + roomName, (eventBody) => {
          console.log(eventBody.body + " RECEIVES THIS VIDEO ID");
          this.setState({ videoId: eventBody.body}, () => {
            console.log(this.state.videoId + " NEW THIS VIDEO ID")})
        });
    });
  }



  getCurrentTime(event){
    event.target.getCurrentTime();
    console.log(event.target.getCurrentTime())
  }

  videoOnReady(event) {
    //event.target.pauseVideo();
    //console.log(event.target)
  }

  // -1 - unstarted (sin empezar)
  //  0 - ended (terminado)
  //  1 - playing (en reproducción)
  //  2 - paused (en pausa)
  //  3 - buffering (almacenando en búfer)
  videoOnStateChange(event){
    var newState = event.target.getPlayerState();
    var roomName = window.location.pathname.split("/")[2];
    console.log(event.target.getPlayerState())
    var changeRoom = [newState, roomName]
    //stompClient.send("/app/video", {}, JSON.stringify(changeRoom));
  }

  handleSubmit(event){
    event.preventDefault();
    const url = this.state.videoId;
    const id = axios.get('https://streamboxback.herokuapp.com/video/changeurl?url=' + url)
    .then(id => this.setState({ videoId : id.data })
    );
    var roomName = window.location.pathname.split("/")[2];
    var changeIdVideo = [this.state.videoId, roomName];
    console.log(this.state.videoId + "SEND THIS VIDEO ID");
    stompClient.send("/app/video", {}, JSON.stringify(changeIdVideo));
  }

  handleChangeVideoId(event){
    this.setState({ videoId: event.target.value});
    console.log(this.state.videoId + " STATE IN BAR");
  }

  render() {
    const opts = {
      height: '480',
      width: '840',
      playerVars: {
      autoplay: 1,
      },
    };

    return (
      <div>
        <div className="w-50 ml-5">
          <br></br>
          <Form onSubmit={this.handleSubmit}>
            <Input type="text" placeholder={this.state.videoId} bsSize="lg" name="videoId" onChange={this.handleChangeVideoId} />
            <Button type="submit" className="btn-lg btn-dark btn-block"> Buscar </Button>
          </Form>

          <br></br>
          <br></br>
        </div>

        <div className="ml-5">
          <YouTube
            videoId = {this.state.videoId}
            opts = {opts}
            onReady = {this.videoOnReady}
            onStateChange = {this.videoOnStateChange}
            getCurrentTime = {this.getCurrentTime}
          />
        </div>
      </div>

    );
  }

}
