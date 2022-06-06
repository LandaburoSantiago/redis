import * as React from 'react';
import { Button, Card, CardActions,Slide, CardContent, Chip, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { Navbar } from "./components/Navbar";
function App() {
  const [dataCapitulos, setDataCapitulos] = useState();
  const [dataAvailability, setDataAvailability] = useState();
  const [chapterSelected, setChapterSelected] = useState();
  const [openRentDialog, setOpenRentDialog] = useState();
  const [openConfirmDialog, setOpenConfirmDialog] = useState();

  const getData = async ()=>{
    const dataChapters = await axios.get("http://localhost:5000/list");
    const dataAvailibility = await axios.get("http://localhost:5000/listAvailability");
    setDataCapitulos(dataChapters.data)
    setDataAvailability(dataAvailibility.data)
  }
  const handleOpenRentDialog = ()=>{
    setOpenRentDialog(true)
  }

  const handleCloseRentDialog = ()=>{
    setOpenRentDialog(false)
  }

  const handleOpenConfirmDialog = ()=>{
    setOpenConfirmDialog(true)
  }

  const handleCloseConfirmDialog = ()=>{
    setOpenConfirmDialog(false)
  }

  const rent = async (chapter)=>{
    if(chapter){
      const rentChapter = await axios.post(
        "http://localhost:5000/rent", null, {
          params: {
            chapter
          },}
      );
      getData()
    }
  }

  const confirmPay = async (chapter)=>{
    if(chapter){
      const rentChapter = await axios.post(
        "http://localhost:5000/confirmPay", null, {
          params: {
            chapter
          },}
      );
      getData()
    }
  }

  useEffect(() => {
    getData()
  }, []);
  return (
    <div className="App">
      <Navbar />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} padding="10px">
        {dataCapitulos ? (<>
        {Object.keys(dataCapitulos).map((key) => (
          <Grid item xs={16} sm={6} md={4} lg={3}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>                
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {key}
                </Typography>
              <Chip label={dataAvailability[dataCapitulos[key]]} color={dataAvailability[dataCapitulos[key]] === "disponible"? "primary":dataAvailability[dataCapitulos[key]] === "reservado" ? "warning": "success"} />
              </CardContent>
              <CardActions>
                {dataAvailability[dataCapitulos[key]] === "disponible" ? (
                  <div style={{marginLeft:"auto"}}>
                <Button onClick={()=>{
                  setChapterSelected(key)
                  handleOpenRentDialog()
                }} size="small">Alquilar</Button>
                </div>
                ): dataAvailability[dataCapitulos[key]] === "reservado" ? (
                  <>
                  <div style={{marginLeft:"auto"}}>
                  <Button onClick={()=>{
                  setChapterSelected(key)
                  handleOpenConfirmDialog()
                }} size="small">Confirmar pago</Button>
                </div>
                  </>
                ):<div style={{marginLeft:"auto"}}>
                <Button disabled size="small">Alquilar</Button>
              </div>}
              </CardActions>
            </Card>
          </Grid>
        ))}
        </>):(null)}
      </Grid>
      {dataCapitulos?(
        <>
      <Dialog
        open={openRentDialog}
        onClose={handleCloseRentDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Alquilar capítulo"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            ¿Desea alquilar {chapterSelected}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRentDialog}>Cancelar</Button>
          <Button onClick={()=>{rent(dataCapitulos[chapterSelected]); handleCloseRentDialog()}}>Alquilar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Alquilar capítulo"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            ¿Confirmar pago?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancelar</Button>
          <Button onClick={()=>{confirmPay(dataCapitulos[chapterSelected]); handleCloseConfirmDialog()}}>Confirmar</Button>
        </DialogActions>
      </Dialog>
      </>
      ):null}
    </div>
  );
}

export default App;
