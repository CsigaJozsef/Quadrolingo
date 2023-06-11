import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Coordinate} from "../../types/core.model";

/**
 * A játék globális, szerializálhatóan eltárolható állapotainak típusa
 * - selectedBuilding: a kiválasztott épület, amit le szeretnénk rakni
 * - isMouseDown: az egérgomb le van-e nyomva
 * - selectedElement: a pályán kiválasztott elem koordinátája
 * - board
 */
interface IGlobalGame {
    selectedBuilding?: string
    isMouseDown: boolean,
    selectedElement?: Coordinate
}

/**
 * A kiinduló állapot
 */
const initialState: IGlobalGame = {
    isMouseDown: false
}

/**
 * A játék globális szerializálható állapotok "slice"-a,
 * itt találhatók maguk az állapotok,
 * és a hozzájuk tartozó állapotmódosító függvények (reducerek)
 */
export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        /**
         * Az egérgomb lenyomását módosító reducer
         * @param state a slice állapota (kívülről nem elérhető)
         * @param action le van-e nyomva az egérgomb
         */
        setMouseDown: (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                isMouseDown: action.payload
            }
        },

        /**
         * A kiválasztott lehelyezendő épületet módosító reducer
         * @param state a slice állapota (kívülről nem elérhető)
         * @param action a szerializált IBuilding objektum
         */
        setSelectedBuilding: (state, action: PayloadAction<string | undefined>) => {
            return {
                ...state,
                selectedBuilding: action.payload
            }
        },

        /**
         * A pályáról kiválasztott elem koordinátáját módosító reducer
         * @param state a slice állapota (kívülről nem elérhető)
         * @param action az új koordináta
         */
        setSelectedElement: (state, action: PayloadAction<Coordinate | undefined>) => {
            return {
                ...state,
                selectedElement: action.payload
            }
        }
    }
})

export const {
    setMouseDown,
    setSelectedBuilding,
    setSelectedElement
} = gameSlice.actions

export default gameSlice.reducer
