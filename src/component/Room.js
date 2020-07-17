import React, {Component} from 'react';
import { Youtube } from './Youtube';
import { ChatComponent } from './ChatComponent';
import { Container, Row, Col } from 'reactstrap';

export class Room extends Component{


  render() {
   return (
     <Container>
       <div >
         <div>
           <Row>
             <Col sm={8}><Youtube /></Col>
           <Col sm={4}><ChatComponent username={this.props.location.userName} /></Col>
           </Row>
         </div>
       </div>
    </Container>
   );
 }
}
