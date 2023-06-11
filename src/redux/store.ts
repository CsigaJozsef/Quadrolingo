import {configureStore} from "@reduxjs/toolkit";
import gameReducer from './GameSlice'

/**
 * A React Redux "slice"-okat összekötő "store" objektum,
 * az applikációban ez az egyetlen "store" példány.
 *
 * Egy adott kontextuson belül mindenhol elérhető
 */
const store = configureStore({
    reducer: {
        game: gameReducer
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch