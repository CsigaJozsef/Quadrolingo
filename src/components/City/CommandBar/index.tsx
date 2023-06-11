import {AppBar, Box, Button, Container, Toolbar, Tooltip, Typography} from '@mui/material'

import {ChangeEvent, memo, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {GameModelContext} from "../../../context/GameModelContext";
import {useNavigate} from "react-router";
import {Persistence} from "../../../persistence/persistence";
import NotifyContext from "../../../context/NotifyContext";
import {ICommandBarProps} from "../../../types/core.view";
import {EconomyModal} from "./Economy.modal";
import ReportIcon from '@mui/icons-material/Report';
import {NotifyTypeKey} from "../../../util";

/**
 * Ez a komponens a parancssor
 * - Itt tudunk új játékot kezdeni
 * - Lehetőséget ad a játék mentésére és betöltésére
 * - Megtekinthetővé teszi a pénzügyeket
 *
 * @param props
 */
function CommandBar(props: ICommandBarProps) {

    /**
     * Állapot(ok)
     */
    const [state, setState] = useState<{
        open: boolean,
        date: string
    }>({
        open: false,
        date: ''
    })

    /**
     * Horgok
     */
    const navigate = useNavigate()
    const {model, setModel} = useContext(GameModelContext)
    const setKey = useContext(NotifyContext)

    /**
     * Új játék kezdése
     */
    const newGame = () => {
        navigate('/')
        model.simulation.speed = 0
        setModel(model)
    }

    /**
     * Játék mentése
     */
    const saveGame = useCallback(() => {
        const persistence = new Persistence();
        persistence.save(model, props.cityName);
    }, [model, props.cityName])

    /**
     * Játék betöltése, visszatöltés kezelése
     */
    const loadGame = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files)
            return

        if (e.target.value.split('.').slice(-1)[0] !== "json") {
            setKey(NotifyTypeKey.FILETYPE_ERROR)
            return
        }

        const persistence = new Persistence();
        persistence.load(e.target.files[0], (gameMatrix, cityName) => {
            setModel(gameMatrix)
            props.setCityName(cityName)
        });

    }, [setKey, setModel, props])

    /**
     * Pénzügy panel megnyitása
     */
    const openEconomyPanel = () => {
        setState(prevState => ({...prevState, open: true}))
    }

    /**
     * Pénzügy panel bezárása
     */
    const handleCloseModal = () => {
        setState(prevState => ({...prevState, open: false}))
    }

    /**
     * Sebesség állítás
     */
    const handleSpeed = useCallback((speed: 0 | 1 | 2 | 3) => {
        model.simulation.speed = speed

        setModel(model)
    }, [model, setModel])

    /**
     * Katasztrófa jelző
     * - akkor jelenik meg, ha a katasztrófa éppen zajlik
     */
    const displayDisasterWarning = useMemo(() => {
        if (model.simulation.isDisasterActive) {
            return (
                <Button component="label" sx={{ height: '5vh' }}>
                    <Tooltip title='Az infláció jelenleg zajlik!'>
                        <ReportIcon
                            color='error'
                            sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}
                        />
                    </Tooltip>
                </Button>
            )
        } else {
            return <></>
        }
    }, [model.simulation.isDisasterActive])

    /**
     * Dátum megjelenítése
     */
    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            date: model.simulation.getDate.year.toString() + '. ' + model.simulation.getDate.month.toString().padStart(2, '0') + '. ' + model.simulation.getDate.day.toString().padStart(2, '0')
        }))
    }, [model.simulation.getDate])

    return (
        <AppBar position="sticky" sx={{backgroundColor: 'black', height: '5vh'}}>
            <EconomyModal
                isOpen={state.open}
                model={model}
                setModel={setModel}
                onClose={handleCloseModal}
            />
            <Container maxWidth="xl" sx={{
                height: '5vh',
                padding: '0px !important',
                margin: '0px !important'
            }}>
                <Toolbar sx={{
                    minHeight: '5vh !important',
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0px !important',
                    margin: '0px !important'
                }}>
                    <Box
                        sx={{
                            display: {xs: 'none', md: 'flex'},
                            height: '5vh'
                        }}
                    >
                        {displayDisasterWarning}
                        <Button
                            component="label"
                            onClick={newGame}
                            sx={{color: 'white', height: '5vh'}}
                        >
                            Új játék
                        </Button>
                        <Button
                            component="label"
                            onClick={saveGame}
                            sx={{color: 'white', height: '5vh'}}
                        >
                            Mentés
                        </Button>
                        <Button
                            component="label"
                            sx={{color: 'white', height: '5vh'}}
                        >
                            <input type='file' hidden accept=".json,application/json" onChange={loadGame}/>
                            Betöltés
                        </Button>
                        <Button
                            component="label"
                            onClick={openEconomyPanel}
                            sx={{color: 'white', height: '5vh'}}
                        >
                            Pénzügyek
                        </Button>
                    </Box>

                    <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center', height: '5vh'}}>
                        <Typography
                            component="p"
                            sx={{paddingRight: '1vw'}}
                        >
                            {state.date}
                        </Typography>

                        <Button
                            variant="text"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1.1em',
                                height: '5vh',
                                color: model.simulation.speed === 0 ? 'black' : 'white',
                                backgroundColor: model.simulation.speed === 0 ? 'white' : 'black',
                                '&:hover': {
                                    backgroundColor: model.simulation.speed === 0 ? 'white' : 'black'
                                }
                            }}
                            onClick={() => handleSpeed(0)}
                        >
                            ||
                        </Button>
                        <Button
                            variant="text"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1.1em',
                                height: '5vh',
                                color: model.simulation.speed === 1 ? 'black' : 'white',
                                backgroundColor: model.simulation.speed === 1 ? 'white' : 'black',
                                '&:hover': {
                                    backgroundColor: model.simulation.speed === 1 ? 'white' : 'black'
                                }
                            }}
                            onClick={() => handleSpeed(1)}
                        >
                            {'>'}
                        </Button>
                        <Button
                            variant="text"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1.1em',
                                height: '5vh',
                                color: model.simulation.speed === 2 ? 'black' : 'white',
                                backgroundColor: model.simulation.speed === 2 ? 'white' : 'black',
                                '&:hover': {
                                    backgroundColor: model.simulation.speed === 2 ? 'white' : 'black'
                                }
                            }}
                            onClick={() => handleSpeed(2)}
                        >
                            {'>>'}
                        </Button>
                        <Button
                            variant="text"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1.1em',
                                height: '5vh',
                                color: model.simulation.speed === 3 ? 'black' : 'white',
                                backgroundColor: model.simulation.speed === 3 ? 'white' : 'black',
                                '&:hover': {
                                    backgroundColor: model.simulation.speed === 3 ? 'white' : 'black'
                                }
                            }}
                            onClick={() => handleSpeed(3)}
                        >
                            {'>>>'}
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )

}

export default memo(CommandBar)