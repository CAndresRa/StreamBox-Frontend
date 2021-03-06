import React, {Component} from 'react';
import YouTube from 'react-youtube';
import { Form, Input, Button, InputGroup, InputGroupAddon, UncontrolledAlert } from 'reactstrap';
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
    this.synchronize = this.synchronize.bind(this);
    this.publishSynchronize = this.publishSynchronize.bind(this);
  }

  componentDidMount(){
    this.connect();
    var roomName = window.location.pathname.split("/")[2];
    const id = axios.get('https://streamboxback.herokuapp.com/video/videoid?room=' + roomName)
    .then(id => this.setState({ videoId : id.data }, () => {
      console.log(this.state.videoId + " THIS VIDEO ID");
      })
    );

  }

  connect() {
    //http://localhost:8080
    //https://streamboxback.herokuapp.com
    //Connect to endpoint room
    var socket = new SockJs('https://streamboxback.herokuapp.com/websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        var roomName = window.location.pathname.split("/")[2];
        stompClient.subscribe('/topic/video.' + roomName, (eventBody) => {
          console.log(eventBody.body + " RECEIVES THIS VIDEO ID");

          if(eventBody.body === "1"){
            this.publishOnPlay();
          } else if(eventBody.body.includes(",")){
            this.publishOnPause(eventBody.body);
          } else if(eventBody.body.includes(".")){
            this.publishSynchronize(eventBody.body);
          }else {
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
    //if active to video is ready to play
    this.setState({ player : event.target })
    console.log(this.state.player + " this is the event player")
  }

  // -1 - unstarted (sin empezar)
  //  0 - ended (terminado)
  //  1 - playing (en reproducción)
  //  2 - paused (en pausa)
  //  3 - buffering (almacenando en búfer)
  videoOnStateChange(event){
    console.log(event.target.getPlayerState() + " this is the state of video")
  }

  onPlay(event){
    //If play video send signal to backend to broadcast
    const videoStatus = 1;
    var roomName = window.location.pathname.split("/")[2];
    var pausedVideo = [videoStatus, roomName];
    console.log(this.state.videoId + "SEND TO PLAY VIDEO");
    stompClient.send("/app/video", {}, JSON.stringify(pausedVideo));
  }

  publishOnPlay(){
    //change state in browser
    this.state.player.playVideo();
  }

  onPause(event){
    ////If stop video send signal to backend to broadcast
    const videoStatus = 2;
    var roomName = window.location.pathname.split("/")[2];
    var timeOfVideo = this.state.player.getCurrentTime();
    var pausedVideo = [videoStatus, roomName, timeOfVideo];
    console.log(this.state.videoId + "SEND TO PAUSED VIDEO");
    stompClient.send("/app/video", {}, JSON.stringify(pausedVideo));
  }

  publishOnPause(time){
    //change state of video in browser
    var timeUpdate = parseFloat(time.substring(1));
    this.state.player.pauseVideo();
    this.state.player.seekTo(timeUpdate, true);
  }

  synchronize(){
    //broadcast to synchronize video
    const videoStatus = 9
    var roomName = window.location.pathname.split("/")[2];
    var timeOfVideo = this.state.player.getCurrentTime();
    var synchronizeVideo = [videoStatus, roomName, timeOfVideo];
    stompClient.send("/app/video", {}, JSON.stringify(synchronizeVideo));
  }

  publishSynchronize(time){
    var timeUpdate = parseFloat(time);
    this.state.player.seekTo(timeUpdate, true);
  }


  //http://localhost:8080
  //https://streamboxback.herokuapp.com/video
  handleSubmit(event){
    //Change video with id of url link of video youtube
    event.preventDefault();
    const url = this.state.videoId;
    const id = axios.get('https://streamboxback.herokuapp.com/video/changeurl?url=' + url)
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
          <br></br>
          <Form onSubmit={this.handleSubmit}>
            <InputGroup>
              <Input type="text" placeholder="Youtube video URL" bsSize="lg" name="videoId" onChange={this.handleChangeVideoId} />
              <InputGroupAddon addonType="prepend" ><Button type="submit" className="btn-lg btn-dark btn-block"> Search </Button></InputGroupAddon>
            </InputGroup>
          </Form>

          <br></br>

        <div class="embed-responsive embed-responsive-4by3">
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
        <Button className="btn-lg btn-dark btn-block" color="warning" onClick={this.synchronize}> Synchronize </Button>
        <UncontrolledAlert color="info">
            In case of error with the synchronization press  Synchronize button twice to synchronize the whole room.
        </UncontrolledAlert>
      </div>

    );
  }

}
