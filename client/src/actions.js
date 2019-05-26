import * as at from "./constants/ActionTypes";

export function nodeSelect() {
    return dispatch => dispatch({
        type: at.SHOW_NODE_SELECT
    });
}


export function openSidebar() {
    return dispatch => dispatch({
        type: at.SHOW_SIDEBAR
    })
}
