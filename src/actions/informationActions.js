import { SAVE_INFO_REQUEST, SAVE_INFO_SUCCESS, SAVE_INFO_FAILURE, GET_INFO_REQUEST, GET_INFO_SUCCESS, GET_INFO_FAILURE } from "./types";
import InfoAPI from "../apis/InfoAPI";

export const saveInformation = Information => {
    return async dispatch => {
        dispatch({
            type: SAVE_INFO_REQUEST
        });

        const formPayload = new FormData();
        formPayload.append("picture", Information.picture);
        formPayload.append("file", Information.file)
        await InfoAPI.post("/information", formPayload, { headers: { 'Access-Control-Allow-Origin': '*' }})
        .then(res => {
            if (res.status === 200) {
                console.log("Uploaded : ", res.data)
                dispatch({
                    type: SAVE_INFO_SUCCESS,
                    payload: res.data,
                });
            } else {
                dispatch({
                    type: SAVE_INFO_FAILURE,
                    error: res.data || "Sorry, something went wrong!"
                });
            }
        })
        .catch(err => {
            dispatch({
                type: SAVE_INFO_FAILURE,
                error: err.data || "Sorry, something went wrong!"
            });
            
        })
    }
}

export const getInformation = informationId => {
    return async dispatch => {
        dispatch({
            type: GET_INFO_REQUEST
        });
        
        await InfoAPI.get(`/information/${informationId}`, { headers: { 'Access-Control-Allow-Origin': '*' }})
        .then(res => {
            if (res.status === 200) {
                dispatch({
                    type: GET_INFO_SUCCESS,
                    payload: res.data,
                });
            } else {
                dispatch({
                    type: GET_INFO_FAILURE,
                    error: res.data || "Sorry, something went wrong!"
                });
            }
        })
        .catch(err => {
            dispatch({
                type: GET_INFO_FAILURE,
                error: err.response.data.error|| "Sorry, something went wrong!"
            });
            
        })
    }
}