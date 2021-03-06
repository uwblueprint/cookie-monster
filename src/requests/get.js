import { GET } from "./Helper";
import { createReview } from "../Components/ReviewToolLegacy/applicationDataHelpers";

async function getReviewAPI({ user, applicationId }) {
  return GET(`/api/ratings/${user.userId}/${applicationId}`);
}

async function getUserReviewsAPI(user, applicationId) {
  const result = GET(`/api/ratings/${user.uid}`);
  if (result != null) {
    return result;
  } else {
    return createReview(user, applicationId);
  }
}

async function getApplicationReviewsAPI(app) {
  return GET(`/api/ratings/app/${app}`);
}

async function getAllRankingsAPI() {
  return GET(`/api/stackings`);
}

async function getAllReviewsAPI() {
  return GET(`/api/ratings`);
}

async function getApplicationTableData({ user }) {
  return GET(`/api/applications/${user.userId}`);
}
async function getCandidateSubmissions() {
  return GET(`/api/admin/candidate-submissions`);
}

async function getReviewCountAPI({ userId }) {
  return GET(`/api/ratings/${userId}/?` + new URLSearchParams({ count: true }));
}

async function getApplicationCount() {
  return GET("/api/applications/?" + new URLSearchParams({ count: true }));
}

async function getApplicationDetails(applicationId, user) {
  return GET(`/api/applications/${applicationId}/${user.uid}`);
}

async function getAllStackingsAPI(user) {
  return GET(`/api/stackings/${user.user.userId}`);
}

//The second paramater of GET is a boolean if the endpoint requires Authorization
async function getUserAPI(user) {
  return GET(`/api/users/${user.uid}`, false);
}

async function getAllApplicationsAPI() {
  return GET("/api/applications");
}

async function getAllFirebaseUsers() {
  return GET(`/api/admin`);
}

async function getAllProgramsAPI() {
  return GET(`/api/programs/all`);
}

async function getAllProgramUsersAPI(programId) {
  return GET(`/api/programs/${programId}/users`);
}

async function getAllUserProgramsAPI({ userId }) {
  return GET(`/api/users/${userId}/programs`);
}

async function getProgramByID({ programId }) {
  return GET(`/api/programs/${programId}`);
}

export {
  getAllStackingsAPI,
  getAllApplicationsAPI,
  getApplicationCount,
  getApplicationDetails,
  getApplicationTableData,
  getReviewAPI,
  getUserReviewsAPI,
  getReviewCountAPI,
  getUserAPI,
  getAllReviewsAPI,
  getAllRankingsAPI,
  getApplicationReviewsAPI,
  getCandidateSubmissions,
  getAllProgramsAPI,
  getAllFirebaseUsers,
  getAllProgramUsersAPI,
  getAllUserProgramsAPI,
  getProgramByID
};
