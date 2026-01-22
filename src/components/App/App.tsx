import styles from "./App.module.css";

import Game from "../Game/Game";
import Header from "../Header/Header";

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.appInner}>
        <Header />
        <main className={styles.main}>
          <Game />
        </main>
      </div>
    </div>
  );
}

export default App;
