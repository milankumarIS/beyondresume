import { Autocomplete, Box, FormControl, FormControlProps, FormLabel, TextField, Typography } from '@mui/material';
import color from '../../theme/color';


export default function ContrySelector(props: FormControlProps) {
    const { sx, ...other } = props;
    return (
        <FormControl
            sx={{ width: '100%' }}
        >
            <FormLabel>Country</FormLabel>
            <Autocomplete
                id='country-select-demo'
                sx={{ width: 300,borderRadius: color.secondaryRadius }}
                options={countries}
                autoHighlight
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                    <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                            loading='lazy'
                            width='20'
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            alt=''
                        />
                        {option.label} ({option.code}) +{option.phone}
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label='Choose a country'
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                    />
                )}
            />
        </FormControl>
    );
}


const countries: readonly any[] = [
];