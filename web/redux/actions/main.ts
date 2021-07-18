import * as t from "../types";
import axios from "axios";

export const setJwt = (jwt) => dispatch => {
  dispatch({
    type: t.SET_JWT,
    payload: jwt    
  });
}