import React, {Component} from 'react';
import { Youtube } from './Youtube';
import { ChatComponent } from './ChatComponent';

export class Room extends Component{
  render() {
   return (
     <div >
       <div>
         <Youtube />
         <ChatComponent />
       </div>
     </div>
   );
 }
}
