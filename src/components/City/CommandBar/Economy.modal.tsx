import {Box, Button, Chip, Modal, Paper, SxProps, TextField, Theme} from "@mui/material";
import {ChangeEvent, useCallback, useState} from "react";
import {IEconomyModalProps} from "../../../types/core.view";

import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import {Line} from "react-chartjs-2";

/**
 * Stílus(ok)
 */
const paperStyle: SxProps<Theme> = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    padding: '10px'
}

const boxStyle: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}

/**
 * ChartJS regisztráció szükséges a felhasználás előtt
 */
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

/**
 * Pénzügy panel és a hozzá tartozó logikák komponense
 *
 * @param isOpen meg van-e nyitva jelenleg
 * @param model egy GameMatrix állapot példány
 * @param setModel model állapot módosító függvény
 * @param onClose bezárás esemény kezelése
 * @constructor
 */
export function EconomyModal({isOpen, model, setModel, onClose}: IEconomyModalProps) {

    /**
     * Adó állapot (adóállítás miatt, mivel állapottartó a form)
     */
    const [tax, setTax] = useState('')

    /**
     * Adó változtatását kezelő függvény
     */
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTax(e.target.value)
    }, [])

    /**
     * Adó módosítás véglegesítése
     */
    const handleTaxSubmit = useCallback(() => {
        const taxNumber = Number.parseFloat(tax)

        if (isNaN(taxNumber)) {
            return
        }

        if (taxNumber > 100 || taxNumber < 0) {
            return
        }

        model.simulation.currentTax = taxNumber / 100

        setModel(model)
    }, [model, setModel, tax])

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Paper sx={paperStyle}>
                <Box sx={boxStyle}>
                    <Chip label="Adó:"/>
                    <TextField
                        label={`Kivetett adó: ${model.simulation.currentTax}%`}
                        placeholder="Új adó:"
                        multiline
                        variant="standard"
                        color="success"
                        sx={{width: '75%'}}
                        value={tax}
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleTaxSubmit}
                    >
                        Adó kivetése
                    </Button>
                </Box>

                <Box sx={{height: '46%', overflowX: 'scroll'}}>
                    <Line
                        data={model.simulation.economyChart.chartData}
                        options={model.simulation.economyChart.options}
                    />
                </Box>
            </Paper>
        </Modal>
    )
}