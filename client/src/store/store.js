import {create} from 'zustand';

// useAuthStore is a HOOK
export const useAuthStore = create((set) => ({
    auth : {
        username : '',
        active : false
    },
    setUsername : (name) => set((state) => ({ auth : { ...state.auth, username : name}}))

}) )

//This library is used to manage the STATES of REACT....states in the sense means....what if we wrote something inside the Box...after Writing something let say we want to change the letter....so that's where there is a change and this will handle those
//create function is used to create Store...Since we needed Username Property only we have mentioned that
//setUsername function is used to set the username property
//set((state)) has taken the previous state inside it

//...state.auth means we have destructured the properties of the auth object
//suppose there present two properties and we want one prop from it ....so we have destructured it in one varaible and the property we need in the other one