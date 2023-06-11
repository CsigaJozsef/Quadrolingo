import GridElement from "./GridElement";
import CommandBar from "./CommandBar";
import {Box, Stack} from "@mui/material";
import {memo, useContext, useEffect, useMemo} from "react";
import GameBar from "./GameBar";
import {setSelectedBuilding, setSelectedElement} from "../../redux/GameSlice";
import {useAppDispatch} from "../../redux/hooks";
import NotifyContext from "../../context/NotifyContext";
import useDestruction from "../../hooks/useDestruction";
import {DestructionContext} from "../../context/DestructionContext";
import useBlocking from "../../hooks/useBlocking";
import useBuildingChange from "../../hooks/useBuildingChange";
import useCityName from "../../hooks/useCityName";
import {NotifyTypeKey} from "../../util";


const gameSize: number = 100

/**
 * A várost jelképező komponens
 * - Itt történik minden a várost érintő logika összekötése
 * - Itt rendereljük ki a pályát, ez a konkrét játéktér
 */
function City() {

    //Redux
    const dispatch = useAppDispatch()

    const [ cityName, setCityName ] = useCityName()
    const setKey = useContext(NotifyContext)
    const [destruct, setDestruct] = useDestruction()

    useBlocking()
    useBuildingChange()

    /**
     * Itt kezeljük le a romboló mód be- és kikapcsolásához tartozó hatásokat
     */
    useEffect(() => {
        const key = destruct ?
            NotifyTypeKey.DESTRUCTION_MODE_ON
            :
            NotifyTypeKey.DESTRUCTION_MODE_OFF

        if (destruct) {
            dispatch(setSelectedBuilding(undefined))
            dispatch(setSelectedElement(undefined))
        }

        setKey(key)
    }, [destruct, dispatch, setKey])

    /**
     * A játéktér feltöltése GridElement komponensekkel
     */
    const renderGame = useMemo(() => {
        const grid = []

        for (let i = 0; i < gameSize; i++) {
            const row = []
            for (let j = 0; j < gameSize; j++) {
                row.push(<GridElement
                    key={j}
                    coord={{x: j, y: i}}
                />)
            }
            grid.push(<Stack
                key={i}
                component="div"
                direction="row"
                sx={{width: '400em', height: '4em'}}
                children={row}
            ></Stack>)
        }

        return grid
    }, [])

    return (
        <>
            <CommandBar cityName={cityName} setCityName={setCityName}/>
            <DestructionContext.Provider value={{destruct, setDestruct}}>
                <Box
                    component="div"
                    sx={{
                        overflowY: 'scroll',
                        position: 'relative',
                        height: '73vh',
                        mt: 0
                    }}
                >
                    {
                        renderGame
                    }
                </Box>
                <GameBar/>
            </DestructionContext.Provider>
        </>
    )

}

export default memo(City)