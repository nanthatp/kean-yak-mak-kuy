import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";


import { TypeProductInterface } from "../interfaces/ITypeproduct";
import { ManufacturerInterface } from "../interfaces/IManufacturer";
import { EmployeeInterface } from "../interfaces/IEmployee";
import { ProductInterface } from "../interfaces/IProduct";

import { LotsInterface } from "../interfaces/ILot";
import { ShelfproductInterface } from "../interfaces/IShelfproduct";
import { StockInterface } from "../interfaces/IStock";



import {
  GetEmployeeByEID,
  GetProducts,
  GetLot,
  GetShelfproduct,
  Stocks,
} from "../services/HttpClientService";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function StockCreate() {
  const [lots, setLots] = useState<LotsInterface[]>([]);
  const [shelfs, setShelfs] = useState<ShelfproductInterface[]>([]);
  const [employees, setEmployees] = useState<EmployeeInterface>();
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [stock, setStock] = useState<StockInterface>({});

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof StockCreate;
    const { value } = event.target;
    setStock({ ...stock, [id]: value });
  };

  
  
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };
  
  const handleChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof typeof stock;
    setStock({
      ...stock,
      [name]: event.target.value,
    });
  };

  const getProduct = async () => {
    let res = await GetProducts();
    if (res) {
      setProducts(res);
    }
  };

  const getShelfproduct = async () => {
    let res = await GetShelfproduct();
    if (res) {
      setShelfs(res);
    }
  };

  const getLot = async () => {
    let res = await GetLot();
    if (res) {
      setLots(res);
    }
  };

  const getEmployee = async () => {
    let res = await GetEmployeeByEID();
    stock.EmployeeID = res.ID;
    if (res) {
      setEmployees(res);
    }
  };

  useEffect(() => {
    getProduct();
    getLot();
    getEmployee();
    getShelfproduct();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };



  async function submit() {
    let data = {
        ProductID: convertType(stock.ProductID),
        Quantity: typeof stock.Stock_quantity === "string" ? parseInt(stock?.Stock_quantity) : 0,
        LotID: convertType(stock.LotID),
        ShelfproductID: convertType(stock.ShelfproductID),
        EmployeeID: convertType(stock.EmployeeID),

        
    };
    console.log(data)
    let res = await Stocks(data);
    if (res) {
      setSuccess(true);
    } else {
      setError(true);
    }
  }

  return (
    <Container maxWidth="md">
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          Successed!!
        </Alert>
      </Snackbar>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error">
          Unsuccess!!
        </Alert>
      </Snackbar>
      <Paper>
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box sx={{ paddingX: 2, paddingY: 1 }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              PRODUCT RECORD
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="demo-simple-select-label">Product</InputLabel>      
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Product"
                  native
                  value={stock.ProductID + ""}
                  onChange={handleChange}
                  inputProps={{
                    name: "ProductID",
                  }}                
                >
                  <option aria-label="None" value=""></option>
                  {products.map((item: ProductInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Product_name}
                    </option>
                  ))}
                </Select>
            </FormControl>            
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="demo-simple-select-label">Shelf</InputLabel>      
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Shelf"
                  native
                  value={stock.ShelfproductID + ""}
                  onChange={handleChange}
                  inputProps={{
                    name: "ShelfproductID",
                  }}                
                >
                  <option aria-label="None" value=""></option>
                  {shelfs.map((item: ShelfproductInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Shelf_name}
                    </option>
                  ))}
                </Select>
            </FormControl>            
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
            <TextField
                id="Stock_quantity"
                variant="outlined"
                type="number"
                size="medium"
                placeholder="Quantity"
                value={stock.Stock_quantity || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="demo-simple-select-label">Lot</InputLabel>      
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="LotID"
                  native
                  value={stock.LotID + ""}
                  onChange={handleChange}
                  inputProps={{
                    name: "LotID",
                  }}                
                >
                  <option aria-label="None" value=""></option>
                  {lots.map((item: LotsInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.ID}
                    </option>
                  ))}
                </Select>
            </FormControl>  
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-label">Employee</InputLabel>      
              <Select
                native
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Employee"                
                value={stock.EmployeeID + ""}
                onChange={handleChange}
                disabled
                inputProps={{
                  name: "EmployeeID",
                }}
              >
                <option aria-label="None" value=""></option>
                <option value={employees?.ID} key={employees?.ID}>
                  {employees?.FirstName} {employees?.LastName}
                </option>    
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/stocks"
              variant="contained"
              color="inherit"
            >
              BACK
            </Button>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
            >
              SAVE
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default StockCreate;