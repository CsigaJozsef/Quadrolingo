import {IUpgradeProps} from "../../../../types/core.view";
import {Button, Chip, Grid} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {Zone} from "../../../../model/zone/Zone";

/**
 * A fejlesztést kezelő felület
 * - csak akkor jelenik meg, ha fejleszthető az építmény, és az Zóna típusú
 * @param canUpgrade fejleszthető-e az építmény
 * @param isMin minimális szintű-e az építmény
 * @param isMax maximális szintű-e az építmény
 * @param element a kiválasztott épület
 * @param onUpgrade fejlesztést kezelő esemény
 * @param onDemote visszafejlesztést kezelő esemény
 */
export default function Upgrade({canUpgrade, isMin, isMax, element, onUpgrade, onDemote}: IUpgradeProps) {
    if (canUpgrade && element instanceof Zone) {
        return (
            <>
                <Grid container mt={1}>
                    <Grid item md={3}>
                        <Chip label="Fejlesztés:"/>
                    </Grid>
                    <Grid item md={1}></Grid>
                    <Grid item md={8}>
                        <Chip
                            label={!isMax ? element.upgradeCost + 'Ql' : 'MAX'}
                            variant="outlined"
                            sx={{width: '80%'}}
                        />
                    </Grid>
                </Grid>


                <Grid container>
                    <Grid item xs={6}>
                        <Button
                            variant='contained'
                            color='success'
                            sx={{width: '90%', mt: 0.5}}
                            onClick={onUpgrade}
                            disabled={isMax}
                        >
                            <ArrowUpwardIcon/>
                        </Button>
                    </Grid>

                    <Grid item xs={6}>
                        <Button
                            variant='contained'
                            color='primary'
                            sx={{width: '90%', mt: 0.5}}
                            onClick={onDemote}
                            disabled={isMin}
                        >
                            <ArrowDownwardIcon/>
                        </Button>
                    </Grid>
                </Grid>
            </>
        )
    } else {
        return <></>
    }

}