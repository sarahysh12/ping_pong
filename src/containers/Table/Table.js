import React, {Component} from 'react';
import './Table.css';
import Sketch from 'react-p5';
import ballIncomingSound from '../../sounds/ball-incoming.mp3';
import ballOutgoingSound from '../../sounds/ball-outgoing.mp3';
import gameOverSound from '../../sounds/game-over.mp3';

class Table extends Component {

    state = {
        score: 0,
        isMobile: false,
        timer: 0,
        isGameOver: false,
        start: null
    }
    permissionGranted = false;
    
    playerPaddle = null;
    playerPaddleVel = null;
    
    ballVelocity = null;
    ball = null;

    componentDidMount = () => {   
        setInterval(this.timer, 1000);
    }

    timer = () => {
        this.setState({ timer: this.state.timer+1 });
    }

    resetScore = () => {
        this.setState({score: 0}); 
    }

    setup = (p5) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        this.playerPaddle = p5.width / 2 - 50;

        this.ball = p5.createVector(p5.width/2, p5.height/2);
        this.ballVelocity = p5.createVector(Math.random(-1,1), Math.random(-1,1));
        this.ballVelocity.mult(3);

      if(typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
          this.setState({isMobile: true});
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


    resetGame = () => {
        this.setState({isGameOver: false});
        this.setState({score: 0});
        this.setState({timer: 0});
    }

    draw = p5 => {
        // if(!this.permissionGranted) return;
        p5.background('#3d86d4')

        let playerColor = p5.color('#3718b5');
        p5.fill(playerColor);
        p5.noStroke();
        p5.rect(this.playerPaddle, p5.height - 20, 100, 10, 20);

        if(this.state.isMobile) {
            this.playerPaddleVel = p5.constrain(p5.rotationY, -3, 3);
            this.playerPaddle += this.playerPaddleVel*5;
            this.playerPaddle = p5.constrain(this.playerPaddle, 0, p5.width-100);
        } else {
            if(p5.keyIsDown(p5.LEFT_ARROW)) {
                this.playerPaddleVel -= 5;
            }
            if(p5.keyIsDown(p5.RIGHT_ARROW)) {
                this.playerPaddleVel += 5;
            }
            this.playerPaddleVel *= 0.4;
            this.playerPaddle += this.playerPaddleVel
        }

        /* Draw mesh */
        p5.stroke(255);
        p5.line(0, (p5.height/2)-2, p5.width, (p5.height/2)-2);
        p5.line(0, p5.height/2, p5.width, p5.height/2);

        /* Draw ball */
        let ballColor = p5.color(255);
        p5.fill(ballColor);
        p5.ellipse(this.ball.x, this.ball.y, 30);
        // p5.text(this.state.score, p5.width/2, 50);
        // p5.text(this.state.timer, p5.width/2, 100);

        /* Move ball */
        /* Collision with left and right */
        if (this.ball.x > p5.width || this.ball.x < 0) {
            this.ballVelocity.x *= -1;
        }
        /* Robot play */
        if (this.ball.y <= 20) {
            this.ballVelocity.y *= -1;
            //TODO change this timer for desktop
            if(this.state.timer >= 1000) {
                this.setState({isGameOver: true});
                let audio = new Audio(gameOverSound);
                // audio.play();
                this.resetGame();
                return;
            }
            let audio = new Audio(ballIncomingSound);
            // audio.play();
        }
        /* Collosion with paddle */
        
        if(p5.height - this.ball.y <= 30 && p5.height - this.ball.y >= 0) { 
            // console.log(p5.height - this.ball.y, this.ball.x, this.playerPaddle);
            if( this.ball.x > this.playerPaddle && p5.height - this.ball.x < this.playerPaddle+100) {
                this.ballVelocity.y *= -1;
                let audio = new Audio(ballOutgoingSound);
                // audio.play();
                const newScore = this.state.score;
                this.setState({score: newScore+1});
                
            }
        } 

        this.ball.x += this.ballVelocity.x;
        this.ball.y += this.ballVelocity.y;
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
            <Sketch setup={this.setup} draw={this.draw} />
        </div>
      );
    }
}


export default Table;