import {memo, MouseEvent, useCallback, useContext} from "react";
import Box from "@mui/material/Box";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {setMouseDown, setSelectedBuilding, setSelectedElement} from "../../../redux/GameSlice";
import {useInView} from "react-intersection-observer";
import {GameModelContext} from "../../../context/GameModelContext";
import {NotifyTypeKey, toIBuilding} from "../../../util";
import NotifyContext from "../../../context/NotifyContext";
import {DestructionContext} from "../../../context/DestructionContext";
import {IGridElementProps} from "../../../types/core.view";
import {gridEvent, useHover} from "../../../hooks/useHover";
import {Road} from "../../../model/building/Road";
import {SxProps, Theme} from "@mui/material";

/**
 * A pálya egy elemének megjelenése, és minden ahhoz tartozó logikának a komponense
 *
 * @param props
 */
function GridElement(props: IGridElementProps) {

    const { model, setModel } = useContext(GameModelContext)
    const setKey = useContext(NotifyContext)
    const { destruct } = useContext(DestructionContext)

    const [
        isMouseDown,
        selectedBuilding,
    ] = useAppSelector(
        state => [
            state.game.isMouseDown,
            state.game.selectedBuilding,
        ]
    )

    /**
     * Látóteret kezelő horog
     * - ha valami nincs a látótérben, akkor lebutítjuk
     */
    const [ref, inView] = useInView()

    //Redux
    const dispatch = useAppDispatch()

    const isHovering = useHover(inView, props.coord)

    /**
     * A jelenlegi pozíción tárolt elem lekérése
     */
    const getElement = useCallback(() => {
        return model.board[props.coord.y][props.coord.x].element || undefined
    }, [model.board, props.coord.x, props.coord.y])

    /**
     * Egy elem lehelyezése a selectedBuilding függvényében.
     *
     * - Ha nincs meghatározva a selectedBuilding, akkor nem történik semmi.
     * - GridEvent eseményt vált ki lehyelezéskor a több helyet elfoglaló elemek miatt.
     */
    const placeElement = useCallback(() => {
        if (selectedBuilding) {
            if (model.place(props.coord, toIBuilding(selectedBuilding)!)) {
                const coords = model.getCoordinates(props.coord, toIBuilding(selectedBuilding)!)
                if (coords.length !== 1) {
                    gridEvent.next({coords, build: true})
                }
                setModel(model)
            }else{
                setKey(NotifyTypeKey.OBJECT_COLLISION)
            }
        }
    }, [model, props.coord, selectedBuilding, setKey, setModel])

    /**
     * Lekezeli, ha az egér belép az adott elemre.
     * - Ha a bal egérgomb le van nyomva, és romboló módban vagyunk, akkor törli a tárolt elemet.
     * - Ha a bal egérgomb le van nyomva, és nem vagyunk romboló módban, akkor lerak egy elemet,
     * ha kiválasztottunk egyet (selectedBuilding)
     * - GridEvent eseményt vált ki, ha a bal egérgomb nincs lenyomva
     *
     * @param e - esemény változó, autimatikusan átadásra kerül.
     */
    const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()

        if(isMouseDown && destruct){
            model.destroy(props.coord)
            setModel(model)
            dispatch(setSelectedElement(undefined))
        }

        if (!toIBuilding(selectedBuilding)) return

        if (!isMouseDown) {
            const coords = model.getCoordinates(props.coord, toIBuilding(selectedBuilding)!)
            gridEvent.next({coords, build: false})
        } else {
            placeElement()
        }
    }

    /**
     * Lekezeli, ha az egérgomb le lett nyomva az adott elemen
     * - Ha van valami ezen a pozíción, és nem vagyunk romboló módban, akkor kiválasztásra kerül az az elem
     * - Minden más esetben megvizsgáljuk, hogy le van-e nyomva az egérgomb, ha nincs, akkor átállítjuk az állapotot
     * lenyomott állapotúra
     * - Ha romboló módban vagyunk, akkor töröljük az adott elemet
     * - Ha nem vagyunk romboló módban akkor lerakunk egy elemet
     *
     * @param e - esemény változó, automatikusan átadásra kerül
     */
    const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (model.isOccupied(props.coord) && !destruct) {
            dispatch(setSelectedElement(props.coord))
            dispatch(setSelectedBuilding(undefined))
            gridEvent.next({ coords: [], build: false })
        } else {
            if (!isMouseDown) {
                dispatch(setMouseDown(true))

                if(destruct){
                    model.destroy(props.coord)
                    setModel(model)

                    requestIdleCallback(
                        () => dispatch(setSelectedElement(undefined)),
                        { timeout: 10 }
                    )

                }else{
                    placeElement()
                }
            }
        }

    }, [destruct, dispatch, isMouseDown, model, placeElement, props.coord, setModel])

    /**
     * Lekezeljük, ha felengedtük az egérgombot
     *
     * @param e - esemény változó, automatikusan átadásra kerül
     */
    const handleMouseUp = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        dispatch(setMouseDown(false))
    }, [dispatch])

    /**
     * Ha létezik az adott pozíción egy elem, akkor visszaadjuk a textúráját
     */
    const getBackgroundImage = useCallback(() => {
        if (getElement()) {
            return getElement().texture
        }
    }, [getElement])

    /**
     * Különböző állapotok hatására filtereket alkalmazunk
     * - isHovering: ha az adott elemen átmegy a kurzor, akkor a fényerőt lejjebb vesszük
     * - Ha van az adott pozíción épület, és éppen tűzeset történik, akkor piros filtert rakunk rá
     */
    const getFilter = useCallback(() => {
        let filter: string = ""

        if(isHovering){
            filter += "brightness(0.6) "
        }

        if(getElement() && getElement()?.isOnFire){
            filter += "hue-rotate(0deg) "
        }

        return filter.trimEnd()
    }, [getElement, isHovering])

    /**
     * Ha az adott pozíción egy út van, akkor útvezetést rajzolunk rá
     */
    const renderRoad = useCallback(() => {
        if (getElement() instanceof Road) {
            const {up, down, left, right} = (getElement() as Road).connection
            let horizontalSx: SxProps<Theme> = {
                position: "absolute",
            }

            let verticalSx: SxProps<Theme> = {
                position: "absolute",
            }

            if(up && down){
                verticalSx = {
                    ...verticalSx,
                    borderLeft: '3px dashed white',
                    top: 0,
                    left: '50%',
                    width: 'inherit',
                    height: 'inherit'
                }
            }else if(up && !down){
                verticalSx = {
                    ...verticalSx,
                    borderLeft: '3px dashed white',
                    top: 0,
                    left: '50%',
                    width: 'inherit',
                    height: '50%'
                }
            }else if(!up && down){
                verticalSx = {
                    ...verticalSx,
                    borderLeft: '3px dashed white',
                    bottom: 0,
                    left: '50%',
                    width: 'inherit',
                    height: '50%'
                }
            }

            if(left && right){
                horizontalSx = {
                    ...horizontalSx,
                    borderTop: '3px dashed white',
                    left: 0,
                    top: '50%',
                    width: 'inherit',
                    height: 'inherit'
                }
            }else if(left && !right){
                horizontalSx = {
                    ...horizontalSx,
                    borderTop: '3px dashed white',
                    left: 0,
                    top: '50%',
                    width: '50%',
                    height: 'inherit'
                }
            }else if(!left && right){
                horizontalSx = {
                    ...horizontalSx,
                    borderTop: '3px dashed white',
                    right: 0,
                    top: '50%',
                    width: '50%',
                    height: 'inherit'
                }
            }


            return (
                <>
                    <Box
                        component="span"
                        sx={verticalSx}
                    >
                    </Box>
                    <Box
                        component="span"
                        sx={horizontalSx}
                    >
                    </Box>
                </>
            )
        }

        return <></>
    }, [getElement])

    if (inView) {
        return (
            <Box
                component="div"
                sx={{
                    width: '4em', height: '4em',
                    backgroundImage: `url(${getBackgroundImage()})`,
                    backgroundSize: '4em 4em',
                    backgroundRepeat: 'no-repeat',
                    filter: `${getFilter()}`,
                    position: 'relative'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                ref={ref}
            >
                { renderRoad() }
            </Box>
        )
    } else {
        return <span ref={ref} style={{
            width: '4em', height: '4em',
            backgroundImage: `url(${getBackgroundImage()})`,
            backgroundSize: '4em 4em',
            backgroundRepeat: 'no-repeat',
            filter: `${ getElement() && getElement()?.isOnFire ? 'hue-rotate(0deg)' : null }`
        }}></span>
    }
}

export default memo(GridElement)