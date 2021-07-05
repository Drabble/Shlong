import * as t from "../types";

const main = (state = {
    jwt: "",
}, action) => {
  switch(action.type){
    case t.SET_JWT:
      return { 
        ...state,
        jwt: action.payload
      };
    default:
      return {...state};
    }
}

export default main;