import { Typography } from "@mui/material"

export const Paragraph = ({ text }: any) => {
    return (
        <Typography variant="body1" sx={{ fontSize: '16px',textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: text }}>
        </Typography>
    )
}