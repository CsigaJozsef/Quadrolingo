import {createContext} from "react";
import {NotifyContextType} from "../types/core.view";

/**
 * Ez a kontextus lehetővé teszi, hogy bárhol változtathassuk meg
 * a megjeleníteni kívánt értesítést
 */
const NotifyContext = createContext<NotifyContextType>(
    () => {}
)

export default NotifyContext