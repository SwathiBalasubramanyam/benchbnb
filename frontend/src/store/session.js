import csrfFetch from "./csrf"

export const SET_SESSION_USER = "sessions/SET_SESSION_USER"
export const REMOVE_SESSION_USER = "sessions/REMOVE_SESSION_USER"

export const setSessionUser = (user) => {
    return {
        type: SET_SESSION_USER,
        user: user
    }
}

export const removeSessionUser = () => {
    return {
        type: REMOVE_SESSION_USER
    }
}

export const storeCSRFToken = (response) => {
    const csrfToken = response.headers.get("X-CSRF-Token");
    if (csrfToken) sessionStorage.setItem("X-CSRF-Token", csrfToken);
}

export const storeCurrentUser = user => {
    if (user) sessionStorage.setItem("currentUser", JSON.stringify(user));
}

export const removeCurrentUser = () => {
    sessionStorage.removeItem("currentUser");
}

export const login = (email, password) => {
    return async(dispatch) => {
        const res = await csrfFetch('/api/session', {
            method: "POST",
            body: JSON.stringify({email: email, password: password}),
            headers: {
                'Accept': 'application/json'
            }
        })
        const data = await res.json();
        storeCurrentUser(data.user);
        dispatch(setSessionUser(data.user));  
        return res;
    }
}

export const signUp = (user) => {
    return async(dispatch) => {
        const response = await csrfFetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json'
            }
        })
        const data = await response.json()
        storeCurrentUser(data.user);
        dispatch(setSessionUser(data.user));
        return response;
    }
}

export const logout = () => {
    return async(dispatch) => {
        const res = await csrfFetch('/api/session', {method: 'DELETE'})
        removeCurrentUser();
        dispatch(removeSessionUser());
        return res;
    }
}

export const restoreSession = () => async dispatch => {
    const response = await csrfFetch("/api/session");
    storeCSRFToken(response);
    const data = await response.json();
    storeCurrentUser(data.user);
    dispatch(setSessionUser(data.user));
    return response;
};

const sessionReducer = (state = {user: JSON.parse(sessionStorage.getItem("currentUser"))}, action) => {
    let nextState = {...state}
    switch (action.type) {
        case SET_SESSION_USER:
            nextState.user = action.user
            return nextState;
        case REMOVE_SESSION_USER:
            nextState.user = null;
            return nextState;
        default:
            return state;
    }
}

export default sessionReducer;