import { AppBar, Toolbar, Typography } from "@mui/material";

export const TopBar = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="div">
            Adventje time
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};
