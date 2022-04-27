const submissionTypeReducer = (state = null, action) => {
  switch (action.type) {
    case "SUBMISSION_TYPE":
      return action.payload;
    default:
      return state;
  }
};
export default submissionTypeReducer;
