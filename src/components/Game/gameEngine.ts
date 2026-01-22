export type Bot = {
  id: number;
  name: string;
  dist: number;
  movSpeed: number;
};

export type Message = {
  id: number;
  title: string;
  desc?: string;
};

export type GameState = {
  tower: {
    atkDist: number;
  };
  bots: Bot[];
  messages: Message[];
  playing: boolean;
  turn: number;
  nextMessageId: number;
  autoBattle: boolean;
};

const INITIAL_TOWER = { atkDist: 50 };
const INITIAL_BOTS: Bot[] = [
  { id: 0, name: "BotA", dist: 100, movSpeed: 10 },
  { id: 1, name: "BotB", dist: 50, movSpeed: 20 },
  { id: 2, name: "BotC", dist: 30, movSpeed: 20 },
];

const createMessage = (id: number, title: string, desc = ""): Message => ({
  id,
  title,
  desc,
});

export const createInitialState = (): GameState => ({
  tower: { ...INITIAL_TOWER },
  bots: INITIAL_BOTS.map((bot) => ({ ...bot })),
  messages: [createMessage(0, 'Push "Next step", pls')],
  playing: true,
  turn: 0,
  nextMessageId: 1,
  autoBattle: false,
});

export const selectPriorityBot = (bots: Bot[]): Bot | null => {
  if (!bots.length) {
    return null;
  }

  return bots.reduce((bot1, bot2) => {
    if (bot1.dist !== bot2.dist) {
      return bot1.dist < bot2.dist ? bot1 : bot2;
    }

    return bot1.movSpeed > bot2.movSpeed ? bot2 : bot1;
  });
};

export type GameAction =
  | { type: "NEXT_STEP" }
  | { type: "RESET" }
  | { type: "TOGGLE_AUTO" }
  | { type: "STOP_AUTO" };

export const appendMessage = (
  messages: Message[],
  nextMessageId: number,
  title: string,
  desc?: string,
) => {
  const message = createMessage(nextMessageId, title, desc);
  return {
    messages: messages.concat(message),
    nextMessageId: nextMessageId + 1,
  };
};

export const advanceBots = (bots: Bot[]) => {
  const updatedBots = bots.map((bot) => ({
    ...bot,
    dist: bot.dist - bot.movSpeed,
  }));
  const breached = updatedBots.some((bot) => bot.dist <= 0);
  return { updatedBots, breached };
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "RESET":
      return createInitialState();
    case "TOGGLE_AUTO":
      return {
        ...state,
        autoBattle: state.playing ? !state.autoBattle : state.autoBattle,
      };
    case "STOP_AUTO":
      return {
        ...state,
        autoBattle: false,
      };
    case "NEXT_STEP": {
      if (!state.playing) {
        return state;
      }

      const target = selectPriorityBot(state.bots);
      let bots = state.bots.map((bot) => ({ ...bot }));
      let messages = state.messages;
      let nextMessageId = state.nextMessageId;
      const turn = state.turn + 1;
      let playing = state.playing;

      if (!target) {
        const log = appendMessage(messages, nextMessageId, "No bots detected.");
        return {
          ...state,
          ...log,
          playing: false,
          turn,
          autoBattle: false,
        };
      }

      if (target.dist <= state.tower.atkDist) {
        bots = bots.filter((bot) => bot.id !== target.id);
        const log = appendMessage(
          messages,
          nextMessageId,
          `Turn ${turn}: Kill ${target.name} at ${target.dist}m`,
        );
        messages = log.messages;
        nextMessageId = log.nextMessageId;
      } else {
        const log = appendMessage(messages, nextMessageId, "Waiting...");
        messages = log.messages;
        nextMessageId = log.nextMessageId;
      }

      if (bots.length === 0) {
        const log = appendMessage(
          messages,
          nextMessageId,
          `Tower WIN in ${turn} turn(s)`,
        );
        return {
          ...state,
          bots,
          ...log,
          playing: false,
          turn,
          autoBattle: false,
        };
      }

      const { updatedBots, breached } = advanceBots(bots);
      bots = updatedBots;
      if (breached) {
        const log = appendMessage(messages, nextMessageId, "You lose");
        messages = log.messages;
        nextMessageId = log.nextMessageId;
        playing = false;
      }

      return {
        ...state,
        bots,
        messages,
        nextMessageId,
        playing,
        turn,
        autoBattle: playing ? state.autoBattle : false,
      };
    }
    default:
      return state;
  }
};
