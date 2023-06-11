import {createContext} from "react";
import {DestructionContextType} from "../types/core.view";

/**
 * Destruction Context
 * - itt hozzuk létre a kontextust, és a hozzá tartozó típust
 * - A célja, hogy egy állapotot globálissá tegyünk és globálisan módosíthassunk
 */
export const DestructionContext = createContext<DestructionContextType>({
    destruct: false,
    setDestruct: () => {}
})