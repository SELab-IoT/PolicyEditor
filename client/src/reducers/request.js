import * as at from '../constants/ActionTypes'

const defaultState = {
    testResult: {}
}

export default function (state = defaultState, action) {

    switch (action.type) {
        case at.TEST_REQUEST:
            return {
                ...state,
                testResult: action.data
            }
        default:
            return state;
    }
}
