import {DEFAULT_DINNER_AI_URL} from "./config";

export const getSavedURLFromLocalStorage = () => {
    return localStorage.getItem('dinnerServerUrl')
}

export const setSavedURLToLocalStorage = (url: string = DEFAULT_DINNER_AI_URL) => {
    localStorage.setItem('dinnerServerUrl', url)
}