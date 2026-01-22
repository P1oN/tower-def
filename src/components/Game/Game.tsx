import { useCallback, useEffect, useReducer } from "react";
import GameView from "./GameView";
import { createInitialState, gameReducer } from "./gameEngine";

const AUTO_BATTLE_INTERVAL_MS = 900;

export default function Game() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState,
  );
  const { messages, bots, playing, tower, autoBattle } = state;
  const handleNextStep = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
  }, []);
  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);
  const handleAutoBattle = useCallback(() => {
    dispatch({ type: "TOGGLE_AUTO" });
  }, []);

  useEffect(() => {
    if (!autoBattle) {
      return undefined;
    }
    if (!playing) {
      dispatch({ type: "STOP_AUTO" });
      return undefined;
    }
    const intervalId = window.setInterval(() => {
      dispatch({ type: "NEXT_STEP" });
    }, AUTO_BATTLE_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [autoBattle, playing]);

  return (
    <GameView
      towerAtkDist={tower.atkDist}
      bots={bots}
      messages={messages}
      playing={playing}
      autoBattle={autoBattle}
      onNextStep={handleNextStep}
      onToggleAuto={handleAutoBattle}
      onReset={handleReset}
    />
  );
}
