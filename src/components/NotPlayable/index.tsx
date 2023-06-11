import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography";

let backgroundImage = require('../../images/homeBackground.jpg')

/**
 * Stílus(ok)
 */
const styles = ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '5vh',

        padding: '1vh',

        width: '100vw',
        height: '100vh',
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
})

/**
 * Egy olyan komponens, ami értesíti a felhasználót, hogy az eszköz nem felel meg a követelményeknek
 */
function NotPlayable() {

    return (
        <Box
            component='div'
            style={styles.bg}
            sx={{flexDirection: 'column'}}
        >
            <Paper
                elevation={6}
                sx={styles.paper}
            >
                <Typography
                    component='h1'
                    variant='h4'
                    mb={3}
                >
                    A játék sajnos nem játszható 😭🦆😭🦆😭
                </Typography>
                <Typography
                    component="p"
                    sx={{
                        color: 'gray',
                        weight: 'light'
                    }}
                >
                    A böngésző szélessége kevesebb mint 1000 pixel.
                </Typography>
                <Typography
                    component="p"
                    sx={{
                        fontSize: '24',
                        color: 'red',
                        weight: 'bold'
                    }}
                >
                    Kérem növelje a böngésző szélességét a játék folytatásához!
                </Typography>
            </Paper>
        </Box>
    )
}

export default NotPlayable