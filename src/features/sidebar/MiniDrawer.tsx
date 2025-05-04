// material-ui
import { styled, Theme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

interface StyledDrawerProps {
  theme: Theme;
  open: boolean;
}

// project imports
const drawerWidth = 123;

function baseMixin(theme: Theme) {
  return {
    zIndex: 1099,
    borderRight: 'none',
    background: theme.palette.background.default,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen + 200,
    }),
  };
}

function openedMixin(theme: Theme) {
  return {
    ...baseMixin(theme),
    width: drawerWidth,
  };
}

function closedMixin(theme: Theme) {
  return {
    ...baseMixin(theme),
    width: 72,
  };
}

const styleFn = ({ theme, open }: StyledDrawerProps) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
});

const MiniDrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(styleFn);

export default MiniDrawerStyled;
