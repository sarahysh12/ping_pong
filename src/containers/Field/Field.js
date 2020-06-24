import React, {Component} from 'react';
import './Field.css';

class Field extends Component {

    state = {
        counter: 0
    }

    render() {
       
        return (
            <div className="PingPong">
                <h1>{this.state.counter}</h1>
            </div>
        );
    }
}

export default Field;