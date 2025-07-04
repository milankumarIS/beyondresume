import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import color from '../../theme/color';

export default function TabsUtil({ value, setValue, tabs }: any) {

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Tabs value={value} onChange={handleChange} TabIndicatorProps={{ sx: { display: 'none' } }}
            sx={{
                '& .MuiTabs-flexContainer': {
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    '.Mui-selected': {
                        backgroundColor: color.secondary,
                        color: color.ternary
                    }
                },
            }}>
            {tabs.map((tab: any, i: number) => (
                <Tab sx={{...color.tabs,marginBottom: '1rem'}} label={tab} key={i} />
            ))}
        </Tabs>
    );
}