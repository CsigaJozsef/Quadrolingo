import {Box, Button, Paper, TextField, Theme, useTheme} from "@mui/material"

import {ChangeEvent, memo, useContext, useEffect, useState} from "react";

import {useNavigate} from "react-router";
import {Persistence} from "../../persistence/persistence";
import {GameModelContext} from "../../context/GameModelContext";

import NotifyContext from "../../context/NotifyContext";
import Typography from "@mui/material/Typography";
import {GameMatrix} from "../../model/GameMatrix";
import {NotifyTypeKey} from "../../util";

let backgroundImage = require('../../images/homeBackground.jpg')

/**
 * "Hibakódok" és jelentésük
 */
const errors = {
    shortname: "Ez a név túl rövid!"
}

/**
 * Stílus(ok)
 */
const styles = (theme: Theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '5vh',

        padding: '10px',

        width: '50vw',
        minHeight: '50vh',

        [theme.breakpoints.down(1410)]: {
            height: "100vh",
            width: '100vw'
        },

        backgroundColor: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(25px)',

    },
    bg: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh'
    },
    input: {
        width: '45%',
        [theme.breakpoints.down(625)]: {
            width: '100%'
        },
    }
})

/**
 * Főoldal komponense
 */
function Home() {

    /**
     * Állapotok
     */
    const [state, setState] = useState<{
        uploaded: boolean,
        newGame: string,
        error?: string
    }>({
        newGame: "",
        uploaded: false
    })

    /**
     * Horgok
     */
    const {setModel} = useContext(GameModelContext)
    const navigate = useNavigate()
    const setKey = useContext(NotifyContext)
    const theme = useTheme()

    /**
     * Hatások
     */
    useEffect(() => {
        document.title = "Quadrolingo 🦆"
    }, [])

    useEffect(() => {
        state.uploaded &&
        navigate(`/game?name=${state.newGame}`)
    }, [state.uploaded, navigate, state.newGame])

    /**
     * Város nevének beállítása
     * @param e esemény paraméter
     */
    const handleNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setState(prevState => ({...prevState, newGame: e.target.value}))
    }

    /**
     * Játék betöltéséhez tartozó logika
     * @param e esemény paraméter
     */
    const handleLoadGame = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files)
            return

        if (e.target.value.split('.').slice(-1)[0] !== "json") {
            setKey(NotifyTypeKey.FILETYPE_ERROR)
            return
        }

        const persistence = new Persistence();
        persistence.load(e.target.files[0], (gameMatrix, cityName) => {
            setModel(gameMatrix)
            setState(prevState => (
                {...prevState, newGame: cityName, uploaded: true}
            ))
        });
    }

    /**
     * Új játék kezdéséhez tartozó logika
     */
    const handleNewGame = () => {
        if (state.newGame.length < 3) {
            setState(prevState => ({...prevState, error: errors.shortname}))
        } else {
            setModel(new GameMatrix(100))
            setState(prevState => ({...prevState, error: undefined}))
            navigate(`/game?name=${state.newGame}`)
        }
    }

    return (
        <Box style={styles(theme).bg}>
            <Paper sx={styles(theme).form}>
                <Typography
                    variant="h3"
                >
                    Quadrolingo 🦆 városépítő szimulátor!
                </Typography>
                <Typography
                    component='p'
                >
                    Made by: Filimon Márk, Istók István, Erdős Áron, Tóth Botond
                </Typography>

                <TextField
                    id="cityname"
                    label="Város neve"
                    variant="standard"
                    color="success"
                    sx={styles(theme).input}
                    onChange={handleNameChange}
                    helperText={state.error || null}
                />

                <Button
                    variant='contained'
                    size='large'
                    color='success'
                    sx={styles(theme).input}
                    onClick={handleNewGame}
                >
                    Kezdés
                </Button>

                <Button
                    variant='contained'
                    size='large'
                    color='secondary'
                    sx={styles(theme).input}
                    component='label'
                >
                    <input type='file' hidden accept=".json,application/json" onChange={handleLoadGame}/>
                    Játékmenet betöltése fájlból
                </Button>
            </Paper>
        </Box>
    )

}

export default memo(Home)