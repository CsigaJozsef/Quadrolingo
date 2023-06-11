import {memo, useCallback, useContext, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {GameModelContext} from "../../../context/GameModelContext";
import {Zone} from "../../../model/zone/Zone";
import {setSelectedElement} from "../../../redux/GameSlice";
import {DestructionContext} from "../../../context/DestructionContext";
import NotifyContext from "../../../context/NotifyContext";
import PlaceScreen from "./screens/Place";
import Upgrade from "./screens/Upgrade";
import {IBuilding} from "../../../types/IBuilding";
import Destroy from "./screens/Destroy";
import {Box} from "@mui/material";
import {NotifyTypeKey} from "../../../util";

/**
 * Az interakciós ablak komponense
 */
function InteractionScreen() {

    /**
     * Redux állapotok
     */
    const [
        selectedBuilding,
        selectedElement
    ] = useAppSelector(
        state => [
            state.game.selectedBuilding,
            state.game.selectedElement
        ]
    )

    /**
     * Horgok
     */
    const {model, setModel} = useContext(GameModelContext)
    const {setDestruct} = useContext(DestructionContext)
    const setKey = useContext(NotifyContext)
    const dispatch = useAppDispatch()

    /**
     * Belső állapotok
     */
    const [
        state,
        setState
    ] = useState<{ canUpgrade: boolean, element?: IBuilding }>(
        {canUpgrade: false}
    )

    /**
     * Hatások
     */
    useEffect(() => {
        if (selectedElement) {
            const element = model.board[selectedElement.y][selectedElement.x].element
            if (element) {
                setState({canUpgrade: element instanceof Zone, element})
            }
        } else {
            setState({canUpgrade: false, element: undefined})
        }
    }, [model, selectedElement])

    /**
     * Fejlesztés eseménykezelője
     * - Csak akkor lehetséges, ha van kiválasztott épület, és az fejleszthető/visszafejleszthető
     */
    const upgrade = useCallback(() => {
        if (selectedElement && state.canUpgrade) {
            model.upgrade(selectedElement)
            setModel(model)
            setKey(NotifyTypeKey.ZONE_UPGRADE)
        }
    }, [selectedElement, state.canUpgrade, model, setModel, setKey])

    /**
     * Visszafejlesztés eseménykezelője
     * - Csak akkor lehetséges, ha van kiválasztott épület, és az fejleszthető/visszafejleszthető
     */
    const demote = useCallback(() => {
        if (selectedElement && state.canUpgrade) {
            model.downgrade(selectedElement)
            setModel(model)
            setKey(NotifyTypeKey.ZONE_DEMOTE)
        }
    }, [selectedElement, state.canUpgrade, model, setModel, setKey])

    /**
     * Építmény lerombolásának eseménykezelője
     */
    const destroy = useCallback(() => {
        if (selectedElement) {
            model.destroy(selectedElement)
            setModel(model)

            setDestruct(false)
            dispatch(setSelectedElement(undefined))
        }
    }, [dispatch, model, selectedElement, setDestruct, setModel])

    return (
        <Box component="div" sx={{
            height: '100%',
            overflowY: 'scroll',
            paddingX: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            backgroundColor: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(10px)',
        }}>
            <PlaceScreen selectedBuilding={selectedBuilding}/>
            <Destroy
                element={state.element}
                onDestroy={destroy}
            />
            <Upgrade
                canUpgrade={state.canUpgrade}
                isMin={model.isMinLevel(selectedElement)}
                isMax={model.isMaxLevel(selectedElement)}
                element={state.element}
                onUpgrade={upgrade}
                onDemote={demote}
            />
        </Box>
    )

}

export default memo(InteractionScreen)