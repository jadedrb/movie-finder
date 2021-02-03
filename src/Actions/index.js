export const SET_DATA = 'SET_DATA'
export const setDataAc = (data) => ({
    type: SET_DATA,
    payload: data
})

export const TOGGLE_MODAL = 'TOGGLE_MODAL'
export const toggleModalAc = () => ({
    type: TOGGLE_MODAL
})

export const SET_CHOICES = 'SET_CHOICES'
export const setChoicesAc = (data) => ({
    type: SET_CHOICES,
    payload: data
})

export const ADD_INPUT = 'ADD_INPUT'
export const addInputAc = (input) => ({
    type: SET_CHOICES,
    payload: input
})

export const GET_MODAL_INFO = 'GET_MODAL_INFO'
export const getModalInfoAc = (data) => ({
    type: GET_MODAL_INFO,
    payload: data
})

export const TOGGLE_MODAL_LOADING = 'TOGGLE_MODAL_LOADING'
export const toggleModalLoadingAc = () => ({
    type: TOGGLE_MODAL_LOADING
})