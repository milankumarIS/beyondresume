import { Typography } from "@mui/material"

export const BoldParagraph = ({ text }: any) => {
    return (
        <Typography variant="subtitle1" paragraph sx={{ fontWeight: 'bold',marginBottom: '1rem',fontSize: '1.5rem' }}>
            {text}
        </Typography>
    )
}