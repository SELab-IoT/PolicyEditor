import * as at from "../constants/ActionTypes";

const defaultState = {
    isShow: false
};

export default function(state = defaultState, action) {
    switch(action.type) {
        case at.SHOW_RIGHT_SIDEBAR:
            console.log("--", action);
            return {
                ...state,
                isShow: !state.isShow
            };
        default:
            return state;
    }
};
