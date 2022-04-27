const minimumsReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_MINIMUMS":
      return action.payload;
    default:
      return state;
  }
};
export default minimumsReducer;
