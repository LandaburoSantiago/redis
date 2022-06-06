import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"

export const Navbar = ()=>(
    <AppBar position="static" color="transparent">
    <Toolbar variant="regular" >
      <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        
      </IconButton>
      <Typography variant="h6" color="inherit" component="div">
      The Mandalorian
      </Typography>
    </Toolbar>
  </AppBar>
)