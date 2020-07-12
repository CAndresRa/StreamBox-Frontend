import React, {Component} from 'react';
import YouTube from 'react-youtube';
import { Form, Input, Button } from 'reactstrap';
import axios from 'axios';
import SockJs from 'sockjs-client';
import Stomp from 'stompjs';
export class Youtube extends Component {

  constructor(props){
    super(props)
    this.state = {
      videoId : ''
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
    var stompClient = null;
    var socket = new SockJs('http://localhost:8080/websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/video.hola', function (eventBody) {
            var obj = (JSON.parse(eventBody.body));
        });
    });
}

  getCurrentTime(event){
    event.target.getCurrentTime();
    console.log(event.target.getCurrentTime())
  }

  videoOnReady(event) {
    event.target.pauseVideo();
    console.log(event.target)
  }

  // -1 - unstarted (sin empezar)
  //  0 - ended (terminado)
  //  1 - playing (en reproducción)
  //  2 - paused (en pausa)
  //  3 - buffering (almacenando en búfer)
  videoOnStateChange(event){
    console.log(event.target.getPlayerState())
    console.log(event.target.getCurrentTime())
  }

  handleSubmit(event){
    event.preventDefault();
    const url = this.state.videoId;
    const id = axios.get('http://localhost:8080/video/changeurl?url=' + url)
    .then(id => this.setState({ videoId : id.data })
    );
  }

  handleChangeVideoId(event){
    this.setState({ videoId: event.target.value});
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
            <Input type="text" placeholder="URL" bsSize="lg" name="videoId" onChange={this.handleChangeVideoId} />
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
