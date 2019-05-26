import * as at from "../constants/ActionTypes";
const defaultState = {
    isShow: false
}
export default function(state = defaultState, action) {
    switch(action.type) {
        case at.SHOW_NODE_SELECT:
            console.log("--", action);
            return {
                ...state,
                isShow: !state.isShow
            };
        default:
            return state;
    }
};
