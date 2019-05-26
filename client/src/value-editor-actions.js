import * as at from "./constants/ActionTypes";

export function onValueEditorOpen() {
    return dispatch => dispatch({
        type: at.SHOW_RIGHT_SIDEBAR
    })

}
