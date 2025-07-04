import { Typography } from "@mui/material"
import color from "../../theme/color"

export const Heading = ({ text }: any) => {
    return (
        <Typography variant="h5" color={color.primery}>
            {text}
        </Typography>
    )
}