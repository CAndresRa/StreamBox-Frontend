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
      player : null
    }

    this.handleChangeVideoId = this.handleChangeVideoId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.connect = this.connect.bind(this);
    this.getCurrentTime = this.getCurrentTime.bind(this);
    this.videoOnReady = this.videoOnReady.bind(this);

    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.publishOnPlay = this.publishOnPlay.bind(this);
    this.publishOnPause = this.publishOnPause.bind(this);
  }

  componentDidMount(){
    this.connect();
  }

  connect() {
    //http://localhost:8080
    var socket = new SockJs('http://localhost:8080/websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        var roomName = window.location.pathname.split("/")[2];
        stompClient.subscribe('/topic/video.' + roomName, (eventBody) => {
          console.log(eventBody.body + " RECEIVES THIS VIDEO ID");
          if(eventBody.body === "1"){
            this.publishOnPlay();
          } else if(eventBody.body === "2"){
            this.publishOnPause();
          } else {
            this.setState({ videoId: eventBody.body}, () => {
              console.log(this.state.videoId + " NEW THIS VIDEO ID")})
          }

        });
    });
  }

  getCurrentTime(event){
    event.target.getCurrentTime();
    console.log(event.target.getCurrentTime())
  }

  videoOnReady(event) {
    this.setState({ player : event.target })
    console.log(this.state.player + " this is the event player")
  }

  // -1 - unstarted (sin empezar)
  //  0 - ended (terminado)
  //  1 - playing (en reproducción)
  //  2 - paused (en pausa)
  //  3 - buffering (almacenando en búfer)
  videoOnStateChange(event){
    var newState = event.target.getPlayerState();
    var roomName = window.location.pathname.split("/")[2];
    console.log(event.target.getPlayerState() + " this is the state of video")
    var changeRoom = [newState, roomName]

  }

  onPlay(event){
    const videoStatus = 1;
    var roomName = window.location.pathname.split("/")[2];
    var pausedVideo = [videoStatus, roomName];
    console.log(this.state.videoId + "SEND TO PLAY VIDEO");
    stompClient.send("/app/video", {}, JSON.stringify(pausedVideo));
  }

  publishOnPlay(){
    //this.state.player.seekTo(200, false);
    this.state.player.playVideo();

  }

  onPause(event){
    //event.target.onPlay();
    const videoStatus = 2;
    var roomName = window.location.pathname.split("/")[2];
    var pausedVideo = [videoStatus, roomName];
    console.log(this.state.videoId + "SEND TO PAUSED VIDEO");
    stompClient.send("/app/video", {}, JSON.stringify(pausedVideo));
  }

  publishOnPause(){
    this.state.player.pauseVideo();
  }

  handleSubmit(event){
    event.preventDefault();
    const url = this.state.videoId;
    const id = axios.get('http://localhost:8080/video/changeurl?url=' + url)
    .then(id => this.setState({ videoId : id.data }, () => {
      var roomName = window.location.pathname.split("/")[2];
      var changeIdVideo = [this.state.videoId, roomName];
      console.log(this.state.videoId + "SEND THIS VIDEO ID");
      stompClient.send("/app/video", {}, JSON.stringify(changeIdVideo));
    })
    );
  }

  handleChangeVideoId(event){
    this.setState({ videoId: event.target.value});
    console.log(this.state.videoId + " STATE IN BAR");
  }

  render() {
    const opts = {
      height: '480',
      width: '730',
      playerVars: {
      //autoplay: 1,
      },
    };

    return (
      <div>
        <div>
          <br></br>
          <Form onSubmit={this.handleSubmit}>
            <Input type="text" placeholder="URL" bsSize="lg" name="videoId" onChange={this.handleChangeVideoId} />
            <Button type="submit" className="btn-lg btn-dark btn-block"> Buscar </Button>
          </Form>

          <br></br>
          <br></br>
        </div>

        <div>
          <YouTube
            videoId = {this.state.videoId}
            opts = {opts}
            onReady = {this.videoOnReady}
            onStateChange = {this.videoOnStateChange}
            getCurrentTime = {this.getCurrentTime}
            onPlay = { this.onPlay }
            onPause = { this.onPause }
          />
        </div>
      </div>

    );
  }

}
