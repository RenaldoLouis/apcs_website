import { styled } from '@mui/material/styles';

export const ResponsiveText = styled('div')(({ theme }) => ({
    fontSize: '16px',
    [theme.breakpoints.up('sm')]: {
        fontSize: '20px',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '24px',
    },
    [theme.breakpoints.up('lg')]: {
        fontSize: '27px',
    },
    [theme.breakpoints.up('xl')]: {
        fontSize: '40px',
    },
}));