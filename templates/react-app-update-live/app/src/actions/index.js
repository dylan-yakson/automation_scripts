export const submissionType = (subType) => ({
  type: "SUBMISSION_TYPE",
  payload: subType,
});

export const getMinimums = (minimums) => ({
  type: "GET_MINIMUMS",
  payload: minimums,
});
