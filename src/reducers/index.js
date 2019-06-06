let initialState = {user:{}};

export default function reducer (state = initialState, action) {
    if(action.type = "GET_USER"){
        return {...state, user:action.user}
    }
   
    return state
  }