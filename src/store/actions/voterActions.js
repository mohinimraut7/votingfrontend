import axios from 'axios';
import { baseUrl } from '../../config/config';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===============================
   ACTION TYPES
================================ */
export const FETCH_VOTERS_REQUEST = 'FETCH_VOTERS_REQUEST';
export const FETCH_VOTERS_SUCCESS = 'FETCH_VOTERS_SUCCESS';
export const FETCH_VOTERS_ERROR   = 'FETCH_VOTERS_ERROR';

export const ADD_VOTER_REQUEST = 'ADD_VOTER_REQUEST';
export const ADD_VOTER_SUCCESS = 'ADD_VOTER_SUCCESS';
export const ADD_VOTER_ERROR   = 'ADD_VOTER_ERROR';

export const EDIT_VOTER_REQUEST = 'EDIT_VOTER_REQUEST';
export const EDIT_VOTER_SUCCESS = 'EDIT_VOTER_SUCCESS';
export const EDIT_VOTER_ERROR   = 'EDIT_VOTER_ERROR';

export const DELETE_VOTER_REQUEST = 'DELETE_VOTER_REQUEST';
export const DELETE_VOTER_SUCCESS = 'DELETE_VOTER_SUCCESS';
export const DELETE_VOTER_ERROR   = 'DELETE_VOTER_ERROR';

/* ===============================
   TOKEN HELPER
================================ */
const getToken = () => {
  const resdata = JSON.parse(localStorage.getItem('resdata'));
  return resdata ? resdata.token : null;
};

/* ===============================
   FETCH VOTERS
================================ */
export const fetchVotersRequest = () => ({
  type: FETCH_VOTERS_REQUEST,
});

export const fetchVotersSuccess = (data) => ({
  type: FETCH_VOTERS_SUCCESS,
  payload: data,
});

export const fetchVotersFailure = (error) => ({
  type: FETCH_VOTERS_ERROR,
  payload: error,
});




// Pagination + Search (voterId OR name)
export const fetchVoters = (
  page = 1,
  limit = 50,
  voterId = '',
  name = '',
  searchHouseNumber=''
) => {
  return async (dispatch) => {
    dispatch(fetchVotersRequest());
    try {
      let url = `${baseUrl}/getVoters?page=${page}&limit=${limit}`;

      // 🔍 Priority 1: voterId search
      if (voterId) {
        url += `&voterId=${encodeURIComponent(voterId)}`;
      }
      // 🔍 Priority 2: name search (English / Marathi)
      else if (name) {
        url += `&name=${encodeURIComponent(name)}`;
      }
       else if (searchHouseNumber) {
        url += `&searchHouseNumber=${encodeURIComponent(searchHouseNumber)}`;
      }
      

      const response = await axios.get(url);
      dispatch(fetchVotersSuccess(response.data));
    } catch (error) {
      dispatch(fetchVotersFailure(error.message));
    }
  };
};


/* ===============================
   ADD VOTER
================================ */
export const addVoterRequest = () => ({
  type: ADD_VOTER_REQUEST,
});

export const addVoterSuccess = (voter) => ({
  type: ADD_VOTER_SUCCESS,
  payload: voter,
});

export const addVoterFailure = (error) => ({
  type: ADD_VOTER_ERROR,
  payload: error,
});

export const addVoter = (voterData) => {
  return async (dispatch) => {
    dispatch(addVoterRequest());
    try {
      const token = getToken();
      const response = await axios.post(
        `${baseUrl}/addVoter`,
        voterData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(addVoterSuccess(response.data.voter));
      toast.success("Voter added successfully", { position: "top-center" });
    } catch (error) {
      dispatch(addVoterFailure(error.message));
      toast.error(
        error.response?.data?.message || "Error adding voter",
        { position: "top-center" }
      );
    }
  };
};

/* ===============================
   EDIT VOTER
================================ */
export const editVoterRequest = () => ({
  type: EDIT_VOTER_REQUEST,
});

export const editVoterSuccess = (voter) => ({
  type: EDIT_VOTER_SUCCESS,
  payload: voter,
});

export const editVoterFailure = (error) => ({
  type: EDIT_VOTER_ERROR,
  payload: error,
});

export const editVoter = (voterId, voterData) => {
  return async (dispatch) => {
    dispatch(editVoterRequest());
    try {
      const token = getToken();
      const response = await axios.post(
        `${baseUrl}/editVoter/${voterId}`,
        voterData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(editVoterSuccess(response.data.voter));
      toast.success("Voter updated successfully", { position: "top-center" });
    } catch (error) {
      dispatch(editVoterFailure(error.message));
      toast.error("Error updating voter", { position: "top-center" });
    }
  };
};

/* ===============================
   DELETE VOTER
================================ */
export const deleteVoterRequest = () => ({
  type: DELETE_VOTER_REQUEST,
});

export const deleteVoterSuccess = (voter_id) => ({
  type: DELETE_VOTER_SUCCESS,
  payload: voter_id,
});

export const deleteVoterFailure = (error) => ({
  type: DELETE_VOTER_ERROR,
  payload: error,
});

export const deleteVoter = (voter_id) => {
  return async (dispatch) => {
    dispatch(deleteVoterRequest());
    try {
      await axios.delete(`${baseUrl}/deleteVoter/${voter_id}`);
      dispatch(deleteVoterSuccess(voter_id));
      toast.success("Voter deleted successfully", { position: "top-center" });
    } catch (error) {
      dispatch(deleteVoterFailure(error.message));
      toast.error("Error deleting voter", { position: "top-center" });
    }
  };
};

/* ===============================
   IMPORT EXCEL (Bulk Upsert)
================================ */
export const importVotersExcel = (votersArray) => {
  return async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/import-voters-excel`,
        votersArray,
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast.success(
        `Inserted: ${response.data.insertedCount}, Updated: ${response.data.updatedCount}`,
        { position: "top-center" }
      );
    } catch (error) {
      toast.error("Error importing voter excel", { position: "top-center" });
    }
  };
};
