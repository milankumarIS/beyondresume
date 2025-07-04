import { Typography } from "@mui/material"

export const ItalicParagraph = ({ text }: any) => {
    return (
        <Typography variant="body2" paragraph sx={{ fontStyle: 'italic',marginBottom: '1rem' }}>
            {text}
        </Typography>
    )
}