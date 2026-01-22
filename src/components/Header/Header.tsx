import React from "react";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <p className={styles.kicker}>Defense Protocol</p>
        <h1>Tower Defence</h1>
      </div>
      <p className={styles.subtitle}>
        Step through each turn, track enemy movement, and hold the line.
      </p>
    </header>
  );
}
