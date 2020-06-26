import React, {Component} from 'react';
import './Field.css';
import Sketch from 'react-p5';

  class Field extends Component {
    state = {
        os: 'nothing',
        permissionGranted: false
    }
    componentDidMount = () => {
        this.setUp()
    }

    draw = () => {
        if(!this.state.permissionGranted){
            return;
        }
        this.setState({os: 'granted'});
        
    }

    requestAccess = () => {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                this.setState({os: response});
                if(response === 'granted') {
                    this.setState({permissionGranted: true})
                    this.draw();
                }
            })
    }

    setUp = () => {
        if(typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
            // ios 13 device
            this.setState({os: '13'})
            this.requestAccess();

        } else {
            // non ios 13
            // background(0,255, 0)
            this.setState({os: 'not 13'})
        }
    }

    render() {
        return (
            <div>
                <p>{this.state.os}</p>
                {this.state.os === '13' ? <button onClick={this.setUp}>Try me</button>: null }
            </div>
        )
    }
}


export default Field;