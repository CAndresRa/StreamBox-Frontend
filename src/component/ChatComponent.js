import React, {Component} from 'react';
import SockJsClient from 'react-stomp';

class ChatComponent extends Component {

  <SockJsClient url='http://localhost:8080/chat-websocket/'
      topics={['/chat/message']}
      onConnect={() => {
          console.log("connected");
      }}
      onDisconnect={() => {
          console.log("Disconnected");
      }}
      onMessage={(msg) => {
          console.log(msg);
      }}
      ref={(client) => {
          this.clientRef = client
  }}/>

  sendMessage = () => {
          this.clientRef.sendMessage('/api/message', JSON.stringify({
              name: this.state.name,
              message: this.state.typedMessage
          }));
      };
  }
