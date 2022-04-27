import { combineReducers } from "redux";
import submissionTypeReducer from "./submissionType";
import minimumsReducer from "./getMinimums";

const allReducers = combineReducers({
  subType: submissionTypeReducer,
  minimums: minimumsReducer,
});

export default allReducers;
