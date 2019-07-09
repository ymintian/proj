let initialState = {user: null};

export default function reducer (state = initialState, action) {
    if(action.type === "GET_USER" && action.user){
        return {...state, user: action.user}
    }
    if(action.type === "TEST_USER"){
        return {...state, user: action.user}
    }
    console.log("state from reducer", state)
    return state
  }