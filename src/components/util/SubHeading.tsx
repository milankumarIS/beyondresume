import { Typography } from "@mui/material"
import color from "../../theme/color"

export const SubHeading = ({ text }: any) => {
    return (
        <Typography variant="subtitle1" color={color.secondary} sx={{ marginBottom: '1rem' }} >
            {text}
        </Typography>
    )
}