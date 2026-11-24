import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0f766e',
            dark: '#115e59',
            light: '#5eead4',
        },
        secondary: {
            main: '#f59e0b',
        },
        background: {
            default: '#f4f7fb',
            paper: '#ffffff',
        },
        text: {
            primary: '#172033',
            secondary: '#64748b',
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h6: {
            fontWeight: 700,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage:
                        'linear-gradient(135deg, #0f766e 0%, #0f5c8a 100%)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontWeight: 600,
                    textTransform: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
        },
    },
})

export default theme