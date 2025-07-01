import { Box, Drawer, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import MiniDrawerStyled from "./MiniDrawer";
import { useDrawerStore } from "../../stores/drawer-store";
import MenuComp from "./MenuComp";
// import { AppThemeProvider } from '../../theme/ThemeProvider';

export default function Sidebar() {
  const drawerStore = useDrawerStore();
  const drawerWidth = 200;
  const downMD = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const drawer = useMemo(() => {
    let drawerSX = {
      paddingLeft: "0px",
      paddingRight: "0px",
      marginTop: "8px",
    };
    if (drawerStore.open)
      drawerSX = {
        paddingLeft: "0px",
        paddingRight: "0px",
        marginTop: "0px",
      };
    return (
      <>
        <Box sx={drawerSX}>
          <MenuComp />
          {/* {drawerOpen} */}
        </Box>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downMD, drawerStore.open]);

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
      }}
      aria-label="mailbox folders"
    >
      {downMD || drawerStore.open ? (
        <Drawer
          variant={downMD ? "temporary" : "persistent"}
          anchor="left"
          open={drawerStore.open}
          onClose={drawerStore.toggle}
          sx={{
            "& .MuiDrawer-paper": {
              mt: downMD ? 0 : 11,
              zIndex: 1099,
              width: drawerWidth,
              bgcolor: "background.default",
              color: "text.primary",
              borderRight: "none",
            },
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {drawer}
        </Drawer>
      ) : (
        <MiniDrawerStyled variant="permanent" open={drawerStore.open}>
          <Box sx={{ mt: 10 }}>{drawer}</Box>
        </MiniDrawerStyled>
      )}
    </Box>
  );
}
