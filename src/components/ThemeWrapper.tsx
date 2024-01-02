import { CssBaseline, PaletteMode, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { ComponentChildren } from 'preact';

const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                  primary: {
                      main: '#d61a1a',
                  },
                  secondary: {
                      main: '#dc143c',
                  },
              }
            : {
                  // palette values for dark mode
                  primary: {
                      main: '#ff5e5e',
                  },
                  secondary: {
                      main: '#ffaf5e',
                  },
                  background: {
                      default: '#1a1a1a',
                  },
              }),
    },
    // components: {
    //     MuiButtonBase: {
    //         defaultProps: {
    //             disableRipple: true, // No more ripple, react and the signals dont like it
    //         },
    //     },
    // },
});

export default function ThemeWrapper(props: { children: ComponentChildren }) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = createTheme(getDesignTokens(prefersDarkMode ? 'dark' : 'light'));

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {props.children}
        </ThemeProvider>
    );
}
