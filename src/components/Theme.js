import { createMuiTheme } from 'material-ui/styles';

export const dark = createMuiTheme({
  overrides: {
    MuiDialog: {
      paper: {
        background: '#222426',
      },
      paperWidthSm: {
        maxWidth: 500,
      },
    },
    MuiListItem: {
      root: {
        color: 'white',
      },
      divider: {
        borderBottom: '1px solid gray',
      },
    },
    MuiListItemText: {
      primary: {
        color: 'white',
      },
      secondary: {
        color: 'white',
      },
    },
    MuiFormControlLabel: {
      label: {
        color: 'white',
      },
    },
    MuiRadio: {
      root: {
        color: '#919293',
      },
    },
    MuiDialogActions: {
      action: {
        color: 'white',
      },
    },
  },
});

export const light = createMuiTheme({
  overrides: {
    MuiDialog: {
      paperWidthSm: {
        maxWidth: 500,
      },
    },
  },
});