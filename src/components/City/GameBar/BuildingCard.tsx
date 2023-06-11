import {Card, CardActionArea, CardContent, CardMedia, createStyles} from "@mui/material";
import Typography from "@mui/material/Typography";
import {IBuildingCardProps} from "../../../types/core.view";
import {memo} from "react";

const style = () => createStyles({
    width: '12em',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1),' +
        ' 0px 20px 15px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden'
})

/**
 * Egy építményt képviselő kártya komponense
 * @param building egy adott építmény
 * @param onSelect kiválasztás esemény eseménykezelő
 */
function BuildingCard({building, onSelect}: IBuildingCardProps) {

    return (
        <Card key={building.name} sx={style}>
            <CardActionArea
                onClick={_ => onSelect(building.name)}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '7em'
                }}
            >
                <CardContent>
                    <Typography variant="caption" component="div">
                        {building.name}
                    </Typography>
                </CardContent>

                <CardMedia
                    component="img"
                    image={building.img}
                    alt={building.name}
                    sx={{
                        width: '5em',
                        height: '5em',
                        objectFit: 'contain',
                        marginRight: '5px'
                    }}
                />
            </CardActionArea>
        </Card>
    )
}

export default memo(BuildingCard)