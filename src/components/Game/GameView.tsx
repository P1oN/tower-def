import styles from "./Game.module.css";
import type { Bot, Message } from "./gameEngine";

type Props = {
  towerAtkDist: number;
  bots: Bot[];
  messages: Message[];
  playing: boolean;
  autoBattle: boolean;
  onNextStep: () => void;
  onToggleAuto: () => void;
  onReset: () => void;
};

export default function GameView({
  towerAtkDist,
  bots,
  messages,
  playing,
  autoBattle,
  onNextStep,
  onToggleAuto,
  onReset,
}: Props) {
  const statusLabel = playing ? "Engaged" : "Paused";
  const autoLabel = autoBattle ? "Auto battle running" : "Auto battle idle";

  return (
    <div className={styles.gameShell}>
      <div className={styles.gameMain}>
        <section className={styles.statusBar}>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Tower Range</span>
            <span className={styles.statusValue}>{towerAtkDist}m</span>
          </div>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Bots Remaining</span>
            <span className={styles.statusValue}>{bots.length}</span>
          </div>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Status</span>
            <span className={styles.statusValue}>{statusLabel}</span>
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
            type="button"
            disabled={!playing}
            onClick={onNextStep}
            className={styles.primaryButton}
          >
            Next step
          </button>
          <button
            type="button"
            disabled={!playing}
            onClick={onToggleAuto}
            className={`${styles.autoButton} ${autoBattle ? styles.autoActive : ""}`}
            aria-pressed={autoBattle}
            aria-label={autoLabel}
          >
            <span className={styles.autoIndicator} aria-hidden="true" />
            Auto battle
          </button>
          <button type="button" onClick={onReset} className={styles.secondaryButton}>
            Restart
          </button>
        </div>
      </div>
      <aside className={styles.logPanel}>
        <div className={styles.sectionHeader}>
          <h2>Combat Log</h2>
          <span>{messages.length} updates</span>
        </div>
        <div className={styles.logList} aria-live="polite" aria-atomic="false">
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
