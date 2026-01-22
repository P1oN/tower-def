import React from 'react';
import styles from './App.module.css';

import Game from '../Game/Game';
import Header from '../Header/Header';

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Game />
    </div>
  );
}

export default App;
