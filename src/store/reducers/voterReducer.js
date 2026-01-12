import {
  FETCH_VOTERS_REQUEST,
  FETCH_VOTERS_SUCCESS,
  FETCH_VOTERS_ERROR,

  ADD_VOTER_REQUEST,
  ADD_VOTER_SUCCESS,
  ADD_VOTER_ERROR,

  EDIT_VOTER_REQUEST,
  EDIT_VOTER_SUCCESS,
  EDIT_VOTER_ERROR,

  DELETE_VOTER_REQUEST,
  DELETE_VOTER_SUCCESS,
  DELETE_VOTER_ERROR
} from "../actions/voterActions";

const initialState = {
  voters: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalVoters: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 50,
  },
  loading: false,
  error: null,
};

const voterReducer = (state = initialState, action) => {
  switch (action.type) {

    /* =====================
       REQUEST STATES
    ====================== */
    case FETCH_VOTERS_REQUEST:
    case ADD_VOTER_REQUEST:
    case EDIT_VOTER_REQUEST:
    case DELETE_VOTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    /* =====================
       FETCH SUCCESS
    ====================== */
    case FETCH_VOTERS_SUCCESS:
      return {
        ...state,
        loading: false,
        voters: action.payload.voters,
        pagination: action.payload.pagination,
      };

    /* =====================
       ADD SUCCESS
    ====================== */
    case ADD_VOTER_SUCCESS:
      return {
        ...state,
        loading: false,
        voters: [...state.voters, action.payload],
      };

    /* =====================
       EDIT SUCCESS
    ====================== */
    case EDIT_VOTER_SUCCESS:
      return {
        ...state,
        loading: false,
        voters: state.voters.map((voter) =>
          voter._id === action.payload._id ? action.payload : voter
        ),
      };

    /* =====================
       DELETE SUCCESS
    ====================== */
    case DELETE_VOTER_SUCCESS:
      return {
        ...state,
        loading: false,
        voters: state.voters.filter(
          (voter) => voter._id !== action.payload
        ),
      };

    /* =====================
       ERROR STATES
    ====================== */
    case FETCH_VOTERS_ERROR:
    case ADD_VOTER_ERROR:
    case EDIT_VOTER_ERROR:
    case DELETE_VOTER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default voterReducer;
