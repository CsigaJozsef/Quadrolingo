/**
 * Ebben a fájlban TypeScripthez igazított React Redux függvények találhatók
 */

import {AppDispatch, RootState} from "./store";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector