import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";

export type Timer = {
  name: string;
  duration: number;
};

type TimerState = {
  isRunning: boolean;
  timers: Timer[];
};

const initValue: TimerState = {
  isRunning: false,
  timers: [],
};

type TimersContextValue = TimerState & {
  addTimer: (timerData: Timer) => void;
  startTimers: () => void;
  stopTimers: () => void;
};

const TimersContext = createContext<TimersContextValue | null>(null);

export function useTimersContext() {
  const timersCtx = useContext(TimersContext);
  if (timersCtx === null) {
    throw new Error("TimersContext is null");
  }
  return timersCtx;
}

type AddTimerAction = {
  type: "ADD_TIMER";
  payload: Timer;
};
type StartTimerAction = {
  type: "START_TIMERS";
};
type StopTimerAction = {
  type: "STOP_TIMERS";
};
type Action = AddTimerAction | StartTimerAction | StopTimerAction;

const timersReducer = (state: TimerState, action: Action): TimerState => {
  if (action.type === "ADD_TIMER") {
    return {
      ...state,
      timers: [...state.timers, action.payload],
    };
  }
  if (action.type === "START_TIMERS") {
    return {
      ...state,
      isRunning: true,
    };
  }
  if (action.type === "STOP_TIMERS") {
    return {
      ...state,
      isRunning: false,
    };
  }
  return state;
};

const TimersContextProvider = ({ children }: PropsWithChildren) => {
  const [timersState, dispatch] = useReducer(timersReducer, initValue);

  const ctx: TimersContextValue = {
    ...timersState,
    addTimer(timerData) {
      dispatch({ type: "ADD_TIMER", payload: timerData });
    },
    startTimers() {
      dispatch({ type: "START_TIMERS" });
    },
    stopTimers() {
      dispatch({ type: "STOP_TIMERS" });
    },
  };
  return (
    <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
  );
};
export default TimersContextProvider;
