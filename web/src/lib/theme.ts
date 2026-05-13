import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary']
    }
    interface PaletteOptions {
        neutral?: PaletteOptions['primary']
    }
}

export const theme = createTheme({
    palette: {
        primary: {
            main: '#0052CC',
        },
        secondary: {
            main: '#42526E',
        },
        success: {
            main: '#00875A',
        },
        neutral: {
            main: '#091E42',
        },
    },
    typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
    },
})