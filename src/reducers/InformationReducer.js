import { SAVE_INFO_REQUEST, SAVE_INFO_SUCCESS, SAVE_INFO_FAILURE, GET_INFO_REQUEST, GET_INFO_SUCCESS, GET_INFO_FAILURE } from "../actions/types";

const initialState = {
    isSavingInformation:false,
    savingInformationError:null,
    savedInformationId:null,
    
    isFetchingInformation:false,
    fetchingInformationError:null,
    informationReceived:null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_INFO_REQUEST:
            return {...state, isSavingInformation: true, savedInformationId:null};
        case SAVE_INFO_SUCCESS:
            return {...state, isSavingInformation: false, savedInformationId:action.payload.id}
        case SAVE_INFO_FAILURE:
            return {...state, isSavingInformation: false, savingInformationError:action.error}

        case GET_INFO_REQUEST:
            return {...state, isFetchingInformation: true, informationReceived:null};
        case GET_INFO_SUCCESS:
            return {...state, isFetchingInformation: false, informationReceived:action.payload}
        case GET_INFO_FAILURE:
            return {...state, isFetchingInformation: false, fetchingInformationError:action.error}
        default:
            return state;
    }
}

export default reducer;