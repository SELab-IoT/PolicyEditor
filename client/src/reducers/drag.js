import * as at from '../constants/ActionTypes';

const defaultState = {

};

export default function(state = defaultState, action) {
    switch(action.type) {
        case at.RECV_TEXT:
            console.log("--", action);
            return {
                bodies: [
                    ...state.bodies, {
                    id: action.payload.id,
                    text: action.payload.text,
                }]
            };
        default:
            return state;
    }
};
