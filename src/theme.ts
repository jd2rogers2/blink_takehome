import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  colors: {
    primary: 'rgb(219, 55, 76)'
  },
});

declare module '@mui/material/styles' {
  interface Theme {
    colors: {
      primary: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    colors?: {
      primary?: string;
    };
  }
}