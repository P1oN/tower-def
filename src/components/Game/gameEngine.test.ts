import { describe, expect, it } from "vitest";
import {
  advanceBots,
  createInitialState,
  gameReducer,
  selectPriorityBot,
} from "./gameEngine";

describe("gameEngine", () => {
  it("selects the closest bot, then the slower one on ties", () => {
    const bots = [
      { id: 1, name: "A", dist: 30, movSpeed: 10 },
      { id: 2, name: "B", dist: 30, movSpeed: 5 },
      { id: 3, name: "C", dist: 40, movSpeed: 20 },
    ];
    const target = selectPriorityBot(bots);
    expect(target?.id).toBe(2);
  });

  it("returns null when no bots exist", () => {
    expect(selectPriorityBot([])).toBeNull();
  });

  it("advances bots and detects breaches", () => {
    const { updatedBots, breached } = advanceBots([
      { id: 1, name: "A", dist: 10, movSpeed: 3 },
      { id: 2, name: "B", dist: 2, movSpeed: 4 },
    ]);
    expect(updatedBots[0].dist).toBe(7);
    expect(updatedBots[1].dist).toBe(-2);
    expect(breached).toBe(true);
  });

  it("kills a bot in range and continues", () => {
    const state = createInitialState();
    const next = gameReducer(state, { type: "NEXT_STEP" });
    expect(next.turn).toBe(1);
    expect(next.bots).toHaveLength(2);
    expect(next.messages.at(-1)?.title).toContain("Kill");
    expect(next.playing).toBe(true);
  });

  it("wins when the last bot is eliminated", () => {
    const state = {
      ...createInitialState(),
      bots: [{ id: 1, name: "Solo", dist: 10, movSpeed: 1 }],
      messages: [],
      nextMessageId: 0,
    };
    const next = gameReducer(state, { type: "NEXT_STEP" });
    expect(next.bots).toHaveLength(0);
    expect(next.playing).toBe(false);
    expect(next.messages.at(-1)?.title).toContain("Tower WIN");
  });

  it("ends the game when bots breach the tower", () => {
    const state = {
      ...createInitialState(),
      tower: { atkDist: 0 },
      bots: [{ id: 1, name: "Runner", dist: 1, movSpeed: 2 }],
      messages: [],
      nextMessageId: 0,
    };
    const next = gameReducer(state, { type: "NEXT_STEP" });
    expect(next.playing).toBe(false);
    expect(next.messages.at(-1)?.title).toBe("You lose");
  });

  it("toggles auto battle only while playing", () => {
    const state = createInitialState();
    const toggled = gameReducer(state, { type: "TOGGLE_AUTO" });
    expect(toggled.autoBattle).toBe(true);
    const stopped = gameReducer(
      { ...state, playing: false, autoBattle: true },
      { type: "TOGGLE_AUTO" },
    );
    expect(stopped.autoBattle).toBe(true);
  });
});
