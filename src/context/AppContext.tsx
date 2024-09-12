import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ReportCondtion } from "../common/CommonType";

type AppState = {
  multiCondition: ReportCondtion | null;
};

type AppAction = {
  type: "APPLY_MULTI_CONDITION";
  payload: ReportCondtion;
};

const initialState: AppState = {
  multiCondition: null,
};

const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
    }
  | undefined
>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "APPLY_MULTI_CONDITION":
      return { ...state, multiCondition: action.payload };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
