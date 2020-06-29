import React, {Component} from 'react';
import './Board.css';
import Sketch from 'react-p5';
import ballIncomingSound from '../../sounds/ball-incoming.mp3';
import ballOutgoingSound from '../../sounds/ball-outgoing.mp3';
import gameOverSound from '../../sounds/game-over.mp3';

class Table extends Component {

    state = {
        score: 0,
        isMobile: false,
        isServe: true,
        hitCount: 0,
        highScore: 0,
        lastHitTime: Date,
        hasGameStarted: true
    }

    permissionGranted = false;
    paddleWidth = 100
    paddleX = null;
    playerPaddleVel = null;
    ballVelocity = null;
    ball = null;
    outRef = React.createRef();
    inRef = React.createRef();
    overRef = React.createRef();

    setup = (p5) => {
        this.resetGame(p5, null)();
        this.grantPermission(p5);
        p5.frameRate(120);
    };


    enableSound = () => {
        this.outRef.current.play();
        this.outRef.current.pause();
        this.inRef.current.play();
        this.inRef.current.pause();
        this.overRef.current.play();
        this.overRef.current.pause();
    }


    grantPermission = (p5) => {
        if(typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function') {
            this.setState({isMobile: true});
            this.setState({hasGameStarted: false});
            // ios 13 device
            DeviceOrientationEvent.requestPermission()
            .catch((error) => {
                //show permission dialog only the first time
                let button = p5.createButton('Grant Access');
                button.style('font-size', '24px');
                button.center();
                button.mousePressed(this.requestAccess(button));
                throw error;
            })
            .then(() => {
                // on any subsequent visits
                let button = p5.createButton('Let\'s Play');
                button.style('font-size', '24px');
                button.center();
                button.mousePressed(() => {
                    this.setState({hasGameStarted: true});
                    button.remove();
                    this.enableSound();
                });
                this.permissionGranted =  true;
            })
        } else {
            // non ios 13
            p5.textSize(48);
            p5.text('non ios 13 device', 100,100);
        }
    }

    requestAccess = (button) => {
        return () => {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if(response === 'granted') {
                        this.permissionGranted = true; 
                    } else{
                        this.permissionGranted =  false;
                    }
                })
                .catch(console.error);
                this.setState({hasGameStarted: true});
                button.remove();
                this.enableSound();
        }
    }

    gameOver = p5 => {
        this.overRef.current.play();

        if (this.state.score > this.state.highScore) {
            this.setState({highScore: this.state.score});
            // second solution
            localStorage.setItem('highScore', this.state.score);
        }

        p5.textSize(45);
        p5.text('Game Over', p5.width/2-100, p5.height/2-200);
        // p5.text(`HighScore: ${localStorage.getItem('highScore')}` , p5.width/2-100, (p5.height/2)+100);
        p5.text(`HighScore: ${this.state.highScore}` , p5.width/2-100, (p5.height/2)+100);
        let button = p5.createButton('Play Again');
        button.position(p5.width/2-50, (p5.height/2)+250);
        button.size(100,40);
        button.mousePressed(this.resetGame(p5, button));

        p5.noLoop();
    }

    resetGame = (p5, button) => { 
        return () => {
            p5.createCanvas(p5.windowWidth, p5.windowHeight);
            this.paddleX = p5.width / 2 - this.paddleWidth / 2;
            this.ball = p5.createVector(p5.width/2, p5.height - 35);
            this.ballVelocity = p5.createVector(0,0);
            this.setState({isServe: true});
            this.setState({score: 0});
            this.setState({hitCount: 0}); 
            if (button != null) {
                button.remove()
            }
            p5.loop();
        }
    }

    draw = p5 => {
        if(this.state.isMobile && !this.permissionGranted) return;
        p5.background('#3d86d4');
        if(this.state.hasGameStarted) {
            p5.textSize(45);
            p5.text(`Score: ${this.state.score}` , p5.width/2-100, (p5.height/2)-50);
        }

        let playerColor = p5.color('#3718b5');
        p5.fill(playerColor);
        p5.noStroke();
        p5.rect(this.paddleX, p5.height - 20, 100, 10, 20);

        /* Draw mesh */
        p5.stroke(255);
        p5.line(0, (p5.height/2)-2, p5.width, (p5.height/2)-2);
        p5.line(0, p5.height/2, p5.width, p5.height/2);

        /* Draw ball */
        let ballColor = p5.color(255);
        p5.fill(ballColor);
        p5.ellipse(this.ball.x, this.ball.y, 30);
        p5.textSize(20);

        /* Collosion with paddle */
        if(p5.height - this.ball.y <= 20 && p5.height - this.ball.y >= 0) { 
            if( this.ball.x >= this.paddleX && this.ball.x <= this.paddleX+this.paddleWidth) {
                this.ballVelocity.y *= -1;
                this.inRef.current.play();
                this.setState({lastHitTime: new Date()});
                const newHit = this.state.hitCount;
                this.setState({hitCount: this.state.hitCount+1});
            } else {
                this.gameOver(p5);
            }
        } 

        /* Move Paddle  */
        if(this.state.isMobile) {
            if(!this.state.isServe) {
                this.playerPaddleVel = p5.constrain(p5.rotationY, -3, 3);
                this.paddleX += this.playerPaddleVel*2;
                this.paddleX = p5.constrain(this.paddleX, 0, p5.width-this.paddleWidth);
            }
        } else {
            if(this.state.isServe && p5.keyIsDown(p5.UP_ARROW)) {
                this.ballVelocity.x = -2;
                this.ballVelocity.y = -2;
                this.setState({isServe: false});
                this.setState({lastHitTime: new Date()})
            }
            if(!this.state.isServe) {
                if(p5.keyIsDown(p5.LEFT_ARROW)) {
                    this.playerPaddleVel -= 5;
                }
                if(p5.keyIsDown(p5.RIGHT_ARROW)) {
                    this.playerPaddleVel += 5;
                }
                this.playerPaddleVel *= 0.4;
                this.paddleX += this.playerPaddleVel;
            }
        }

        /* Collision with left and right */
        if (this.ball.x > p5.width || this.ball.x < 0) {
            this.ballVelocity.x *= -1;
        }
        /* Robot play */
        if (this.ball.y <= 20) {
            this.outRef.current.play();
            let coef = 1;
            if(this.state.hitCount ==  10) {
                coef = 1.1;
                this.setState({hitCount: 0})
            }
            this.ballVelocity.y *= -1 * coef ;
            if (new Date() - this.state.lastHitTime > 3000) {
               this.gameOver(p5);
            } else {
                const newScore = this.state.score;
                this.setState({score: newScore+1});
            }
        }
        
        /* First serve */
        if(this.state.hasGameStarted && this.state.isServe && p5.pAccelerationZ - p5.accelerationZ > 2) {
            this.ballVelocity.x = Math.tanh(p5.rotationX - p5.pRotationX);
            this.ballVelocity.y = -3;
            this.setState({isServe: false});
            this.setState({lastHitTime: new Date()});
        }
        
        /* Move Ball */
        this.ball.x += this.ballVelocity.x*3;
        this.ball.y += this.ballVelocity.y*3;

    };

    render() {
      return (
        <div className="Board">
            <audio ref={this.inRef} src={ballIncomingSound} />
            <audio ref={this.outRef} src={ballOutgoingSound} />
            <audio ref={this.overRef} src={gameOverSound} />
            <Sketch setup={this.setup} draw={this.draw} />
        </div>
      );
    }
}


export default Table;