import {IPlaceScreenProps} from "../../../../types/core.view";
import {toIBuilding} from "../../../../util";
import {Chip, Grid} from "@mui/material";
import {memo} from "react";

/**
 * Lerakási információkat kijelző felület
 * - csak akkor jelenik meg, ha van kiválasztott épület
 * @param selectedBuilding a kiválasztott épület
 */
function PlaceScreen({selectedBuilding}: IPlaceScreenProps) {

    if (selectedBuilding) {
        const building = toIBuilding(selectedBuilding)

        return (
            <Grid container mt={2}>
                <Grid item md={3}>
                    <Chip label="Lerakás:"/>
                </Grid>
                <Grid item md={1}></Grid>
                <Grid item md={8}>
                    <Chip label={`${building?.buildCost} Ql`} variant="outlined" sx={{width: '75%'}}/>
                </Grid>
            </Grid>
        )
    } else {
        return <></>
    }

}

export default memo(PlaceScreen)