import {Box, Chip, Grid, Stack} from "@mui/material";
import InteractionScreen from "./InteractionScreen";
import {Subject} from "rxjs";
import {IBuilding} from "../../../types/IBuilding";
import {memo, useCallback, useContext, useMemo} from "react";
import {DestructionContext} from "../../../context/DestructionContext";
import {GameModelContext} from "../../../context/GameModelContext";
import {buildings} from "../../../util";
import BuildingCard from "./BuildingCard";
import Wave from "react-wavify";

/**
 * Egy esemény, amit akkor váltunk ki, hogyha a felhasználó kiválaszt egy építményt
 */
export const buildingSelectedEvent = new Subject<IBuilding>()

/**
 * A játékot kezelő, a játéktér alatt elhelyezkedő komponens
 * - Lehetőséget ad arra, hogy épületeket válasszunk ki
 * - Kijelzi az anyagi helyzetet, az elégedettséget és a lakosság számát
 * - Megjeleníti az interakciós ablakot
 */
function GameBar() {

    /**
     * Horgok
     */
    const {setDestruct} = useContext(DestructionContext)
    const {model} = useContext(GameModelContext)

    /**
     * Építmény kiválasztásának kezelése
     * @param name az épület neve (garantáltan egyedi)
     */
    const handleSelect = useCallback((name: string) => {
        const elem = buildings.find(b => b.name === name)

        if (elem) {
            buildingSelectedEvent.next(elem.getType())
            setDestruct(false)
        }
    }, [setDestruct])

    /**
     * Építmények kirenderelése
     */
    const renderBuildings = useMemo(() => {
        return buildings.map((building, i) => {
            return (
                <BuildingCard
                    key={i}
                    building={building}
                    onSelect={handleSelect}
                />
            )
        })
    }, [handleSelect])

    return (
        <>
            <Box
                position="fixed"
                sx={{
                    top: 'auto',
                    bottom: 0,
                    width: '100vw',
                    height: '22vh',
                    backgroundColor: 'white'
                }}
            >
                <Grid container sx={{height: '100%'}}>
                    <Grid item md={9}>
                        <Box
                            component="div"
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Grid
                                container
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    // justifyContent: 'center',

                                    paddingLeft: '5%',

                                    height: '20%'
                                }}
                            >
                                <Grid item md={4}>
                                    <Chip
                                        label={`${model.simulation.cityMoney} Ql`}
                                        sx={{width: '75%'}}
                                    />
                                </Grid>
                                <Grid item md={4}>
                                    <Chip
                                        label={`${model.simulation.population} fő`}
                                        sx={{width: '75%'}}
                                    />
                                </Grid>
                                <Grid item md={4}>
                                    <Chip
                                        label={`${model.simulation.overallSatisfaction}%`}
                                        sx={{width: '75%'}}
                                    />
                                </Grid>
                            </Grid>
                            <Box
                                component='div'
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',

                                    overflowX: 'scroll',
                                    height: '80%'
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={2}
                                >
                                    {renderBuildings}
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item md={3} sx={{height: 'inherit'}}>
                        <InteractionScreen/>
                    </Grid>
                </Grid>
                <Wave fill='#0761ba'
                      paused={false}
                      style={{
                          height: '80%',
                          position: 'absolute',
                          bottom: 0,
                          opacity: 0.3,
                          zIndex: -1000
                      }}
                      options={{
                          height: 30,
                          amplitude: 20,
                          speed: 0.3,
                          points: 3
                      }}
                />
            </Box>
        </>
    )

}

export default memo(GameBar)