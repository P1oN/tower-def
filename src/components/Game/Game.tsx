import React, { Component } from "react";
import styles from "./Game.module.css";

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
        atkDist: 50,
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
          desc: "",
        },
      ],
      plaing: true,
    };

    this.baseState = this.state;
  }

  nextStep = () => {
    // console.log(this.state);
    let { bots, messages, tower } = this.state;

    //  select bot from list by Distance and Movement Speed
    let bot = bots.reduce((bot1, bot2) => {
      return bot1.dist < bot2.dist
        ? bot1
        : bot1.dist === bot2.dist
          ? bot1.movSpeed > bot2.movSpeed
            ? bot2
            : bot1
          : bot2;
    });

    if (bot.dist <= tower.atkDist) {
      //  delete bot from list
      bots = bots.filter((b) => b.id !== bot.id);
      //  add status message
      messages.push({
        id: messages.length,
        title: `Turn ${messages.length}: Kill ${bot.name} at ${bot.dist}m`,
        desc: "",
      });
    } else {
      messages.push({
        id: messages.length,
        title: `Waiting...`,
        desc: "",
      });
    }

    if (bots.length) {
      //  reduce bots distance by speed
      bots.forEach((b) => {
        b.dist = b.dist - b.movSpeed;
        if (b.dist <= 0) {
          messages.push({
            id: messages.length,
            title: `You loose`,
            desc: "",
          });
          this.setState({ plaing: false });
        }
      });
      this.setState({ bots: bots });
    } else {
      messages.push({
        id: messages.length,
        title: `Tower WIN in ${messages.length - 1} turn(s)`,
        desc: "",
      });
      this.setState({ plaing: false });
    }
    this.setState({ messages: messages, bots: bots });
  };

  resetGame = () => {
    this.setState({
      tower: {
        atkDist: 50,
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
          desc: "",
        },
      ],
      plaing: true,
    });
  };

  render() {
    let { messages, bots, plaing, tower } = this.state;
    return (
      <div className={styles.gameShell}>
        <div className={styles.gameMain}>
          <section className={styles.statusBar}>
            <div className={styles.statusCard}>
              <span className={styles.statusLabel}>Tower Range</span>
              <span className={styles.statusValue}>{tower.atkDist}m</span>
            </div>
            <div className={styles.statusCard}>
              <span className={styles.statusLabel}>Bots Remaining</span>
              <span className={styles.statusValue}>{bots.length}</span>
            </div>
            <div className={styles.statusCard}>
              <span className={styles.statusLabel}>Status</span>
              <span className={styles.statusValue}>
                {plaing ? "Engaged" : "Paused"}
              </span>
            </div>
          </section>
          <section className={styles.gameChars}>
            <div className={styles.sectionHeader}>
              <h2>Enemy Bots</h2>
              <span>{bots.length} active</span>
            </div>
            <div className={styles.botGrid}>
              {bots.map((bot) => (
                <div key={bot.id} className={styles.gameChar}>
                  <span className={styles.botName}>{bot.name}</span>
                  <span>Distance: {bot.dist}m</span>
                  <span>Speed: {bot.movSpeed}m</span>
                </div>
              ))}
            </div>
            {!bots.length && (
              <div className={styles.emptyState}>
                No bots remain. The tower holds.
              </div>
            )}
          </section>
          <div className={styles.actions}>
            <button
              disabled={!plaing}
              onClick={this.nextStep}
              className={styles.primaryButton}
            >
              Next step
            </button>
            <button onClick={this.resetGame} className={styles.secondaryButton}>
              Restart
            </button>
          </div>
        </div>
        <aside className={styles.logPanel}>
          <div className={styles.sectionHeader}>
            <h2>Combat Log</h2>
            <span>{messages.length} updates</span>
          </div>
          <div className={styles.logList}>
            {messages.map((message) => (
              <div key={message.id} className={styles.logItem}>
                <span className={styles.logTitle}>{message.title}</span>
                {message.desc && (
                  <span className={styles.logDesc}>{message.desc}</span>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    );
  }
}
