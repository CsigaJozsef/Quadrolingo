import {IDestroyProps} from "../../../../types/core.view";
import {Button, Chip, Grid} from "@mui/material";

/**
 * A lerombolási képernyő komponense
 * - csak akkor jelenik meg, ha van kiválasztott elem
 * @param element az aktuális építmény
 * @param onDestroy rombolást kezelő esemény
 */
export default function Destroy({element, onDestroy}: IDestroyProps) {

    if (element) {
        return (
            <>
                <Grid container mt={1}>
                    <Grid item md={3}>
                        <Chip label="Rombolás:" sx={{width: '100%'}}/>
                    </Grid>
                    <Grid item md={1}></Grid>
                    <Grid item md={8}>
                        <Chip label={`${element?.sellValue} Ql`} variant="outlined" sx={{width: '80%'}}/>
                    </Grid>
                </Grid>
                <Button
                    variant='contained'
                    color='error'

                    sx={{mt: 0.5, width: '95%'}}
                    onClick={onDestroy}
                >
                    Lerombolás
                </Button>
            </>
        )
    } else {
        return <></>
    }

}