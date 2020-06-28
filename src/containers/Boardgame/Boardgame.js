import React, {Component} from 'react';
import './Boardgame.css';
import Sketch from 'react-p5';
// import ballIncomingSound from '../../sounds/ball-incoming.mp3';
// import ballOutgoingSound from '../../sounds/ball-outgoing.mp3';
import gameOverSound from '../../sounds/game-over.mp3';

class BoardGame extends Component {

    state = {
        score: 0,
        timer: 0,
        running: true
    }
    cx = 0;
    cy = 0;

    permissionGranted = false;
   
    componentDidMount = () => {
        this.startTimer();
    }

    resetTimer = () => {

    }

    startTimer = () => {

    }

    setup = (p5) => {
        this.cx = p5.width/2;
        this.cy = p5.height/2;
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
      
      if(typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
        // ios 13 device
        DeviceOrientationEvent.requestPermission()
            .catch((error) => {
                //show permission dialog only the first time
                let button = p5.createButton('Grant Access');
                button.style('font-size', '24px');
                button.center();
                button.mousePressed(this.requestAccess);
                throw error;
            })
            .then(() => {
                // on any subsequent visits
                this.permissionGranted =  true;
            })
        } else {
            // non ios 13
            p5.textSize(48);
            p5.text('non ios 13 device', 100,100);
        }
    };

    gameOver = () => {
        if(!this.state.running && this.state.timer === 0) {
            let gameOverAudio = new Audio(gameOverSound);
            gameOverAudio.play();
        }
    }

    draw = p5 => {
        if(!this.permissionGranted) return;
        // rotatinX, rotationY
        p5.background(0);


        const dx = p5.constrain(p5.rotationY, -3, 3);
        const dy = p5.constrain(p5.rotationX, -3, 3);
        this.cx += dx*5;
        this.cy += dy*5;
        this.cx = p5.constrain(this.cx, 0, p5.width);
        this.cy = p5.constrain(this.cy, 0, p5.height);
        p5.noStroke();
        // TODO And not catch by robot
        if(this.cy === 0) {
            const currentScore = this.state.score;
            this.setState({score: currentScore+1});
            // TODO increment just by one
            if(this.state.running) {
                this.setState({timer: 1000});
            }
            if (this.state.timer === 0) {
                this.setState({running: false})
                alert('Game Over');
                // this.gameOver();
            }
        }
        if (p5.rotationX < 0) {
            // this.setState({score: this.cy})
            
            // let audio = new Audio(ballIncomingSound);
            // audio.play();
        }
        // else {
        //     let audio = new Audio(ballIncomingSound);
        //     audio.play();
        // }
        p5.ellipse(this.cx, this.cy, 50, 50);
    };


    requestAccess = () => {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if(response === 'granted') {
                    this.permissionGranted = true; 
                } else{
                    this.permissionGranted =  false;
                }
            })
            .catch(console.error);
        // this.remove();
    }
   
    render() {
      return (
        <div className="Game">
            <p>Score: {this.state.score} Timer: {this.state.timer}</p>
            <Sketch setup={this.setup} draw={this.draw} />
        </div>
      );
    }
}


export default BoardGame;