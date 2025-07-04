import { IconButton, IconButtonProps, styled } from "@mui/material";

export interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

export const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


export const handleExpandClick = (index: number,expanded: any,setExpanded: any) => {
    let tempExpanded: any = [...expanded]
    if (tempExpanded[index] === undefined) {
        tempExpanded[index] = true;
    }
    tempExpanded[index] = !tempExpanded[index]
    setExpanded(tempExpanded);
};