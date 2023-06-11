import {createContext} from "react";
import {GameMatrix} from "../model/GameMatrix";
import {ModelContextType} from "../types/core.view";

/**
 * A GameModel állapotot globális elérhetőségét biztosító kontextus
 */
export const GameModelContext = createContext<ModelContextType>({
    model: new GameMatrix(100),
    setModel: () => {}
})