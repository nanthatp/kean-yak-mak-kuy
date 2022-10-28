import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { StockInterface } from "../interfaces/IStock";
import { GetStocks } from "../services/HttpClientService";

function Stocks() {
  const [stocks, setStocks] = useState<StockInterface[]>([]);

  useEffect(() => {
    getStocks();
  }, []);

  const getStocks = async () => {
    let res = await GetStocks();
    if (res) {
      setStocks(res);
    } 
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ID", width: 50 },
    {
      field: "Product",
      headerName: "Product",
      width: 150,
      valueFormatter: (params) => params.value.Product_name,
    },
    {
      field: "Stock_quantity",
      headerName: "Quantity",
      width: 150,
      valueFormatter: (params) => params.value.Stock_quantity,
    },
    {
      field: "Shelfproduct",
      headerName: "Shelf",
      width: 250,
      valueFormatter: (params) => params.value.Shelf_name,
    },
    {
      field: "Lot",
      headerName: "Lot",
      width: 150,
      valueFormatter: (params) => params.value.ID,
    },
    {
      field: "Employee",
      headerName: "Employee",
      width: 150,
      valueFormatter: (params) => params.value.FirstName +"  " + params.value.LastName,
    },
  ];

  return (
    <div>
      <Container maxWidth="md">
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Stock Information
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/stock/create"
              variant="contained"
              color="primary"
            >
              Create Stock
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={stocks}
            getRowId={(row) => row.ID}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Container>
    </div>
  );
}

export default Stocks;