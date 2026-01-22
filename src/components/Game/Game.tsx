import React, { Component } from 'react';
import styles from './Game.module.css';

type Bot = {
    id: number;
    name: string;
    dist: number;
    movSpeed: number;
};

type Message = {
    id: number;
    title: string;
    desc: string;
};

type State = {
    tower: {
        atkDist: number;
    };
    bots: Bot[];
    messages: Message[];
    plaing: boolean;
};

export default class Game extends Component<Record<string, never>, State> {
    baseState: State;

    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            tower: {
                atkDist: 50
            },
            bots: [
                {
                    id: 0,
                    name: "BotA",
                    dist: 100,
                    movSpeed: 10,
                },
                {
                    id: 1,
                    name: "BotB",
                    dist: 50,
                    movSpeed: 20,
                },
                {
                    id: 2,
                    name: "BotC",
                    dist: 30,
                    movSpeed: 20,
                },
            ],
            messages: [
                {
                    id: 0,
                    title: 'Push "Next step", pls',
                    desc: ''
                }
            ],
            plaing: true
        }

        this.baseState = this.state;
    }

    nextStep = () => {
        // console.log(this.state);
        let { bots, messages, tower } = this.state;

        //  select bot from list by Distance and Movement Speed
        let bot = bots.reduce((bot1, bot2) => {
            return bot1.dist < bot2.dist ? bot1 : bot1.dist === bot2.dist ? bot1.movSpeed > bot2.movSpeed ? bot2 : bot1 : bot2;
        });

        if (bot.dist <= tower.atkDist) {
            //  delete bot from list
            bots = bots.filter(b => b.id !== bot.id);
            //  add status message
            messages.push({
                id: messages.length,
                title: `Turn ${messages.length}: Kill ${bot.name} at ${bot.dist}m`,
                desc: ''
            });
        } else {
            messages.push({
                id: messages.length,
                title: `Waiting... (Hi from Kutuzov)`,
                desc: ''
            });
        }

        if (bots.length) {
            //  reduce bots distance by speed
            bots.forEach(b => {
                b.dist = b.dist - b.movSpeed;
                if (b.dist <= 0) {
                    messages.push({
                        id: messages.length,
                        title: `You loose`,
                        desc: ''
                    });
                    this.setState({ plaing: false });
                }
            });
            this.setState({ bots: bots });
        } else {
            messages.push({
                id: messages.length,
                title: `Tower WIN in ${messages.length - 1} turn(s)`,
                desc: ''
            });
            this.setState({ plaing: false });
        }
        this.setState({ messages: messages, bots: bots });
    }

    resetGame = () => {
        this.setState({
            tower: {
                atkDist: 50
            },
            bots: [
                {
                    id: 0,
                    name: "BotA",
                    dist: 100,
                    movSpeed: 10,
                },
                {
                    id: 1,
                    name: "BotB",
                    dist: 50,
                    movSpeed: 20,
                },
                {
                    id: 2,
                    name: "BotC",
                    dist: 30,
                    movSpeed: 20,
                },
            ],
            messages: [
                {
                    id: 0,
                    title: 'Push "Next step", pls',
                    desc: ''
                }
            ],
            plaing: true
        });
    }

    render() {
        let { messages, bots, plaing } = this.state;
        return (
            <div className={styles.game}>
                <div className={styles.gameChars}>
                    {bots.map(bot => (
                        <div key={bot.id} className={styles.gameChar}>
                            <span>Name: {bot.name}</span>
                            <span>Distance: {bot.dist}</span>
                            <span>Mov. speed: {bot.movSpeed}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.gameMessages}>
                    {messages.map((message) => (
                        <div key={message.id}>
                            <span>{message.title}</span>
                            <span>{message.desc}</span>
                        </div>
                    ))}
                </div>
                <button
                    disabled={!plaing}
                    onClick={this.nextStep}
                    className={styles.gameButton}
                >
                    Next step
                </button>
                <button
                    onClick={this.resetGame}
                    className={`${styles.gameButton} ${styles.resetButton}`}
                >
                    Restart
                </button>
            </div>
        )
    }
}
