import * as t from "../types";
import axios from "axios";
import { request } from "../../util/request";

export const setJwt = (jwt) => dispatch => {
  dispatch({
    type: t.SET_JWT,
    payload: jwt    
  });
}