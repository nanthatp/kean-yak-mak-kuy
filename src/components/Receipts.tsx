import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ReceiptInterface } from "../interfaces/IReceipt";
import { GetReceipts } from "../services/HttpClientService";
import Paper from "@mui/material/Paper/Paper";
import Box from "@mui/material/Box/Box";

function Receipts() {
  const [receipts, setReceipts] = useState<ReceiptInterface[]>([]);

  useEffect(() => {
    getReceipts();
  }, []);

  const getReceipts = async () => {
    let res = await GetReceipts();
    if (res) {
      setReceipts(res);
    } 
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "NO", width: 30 },
    {
      field: "Cart",
      headerName: "Cart Number",
      width: 135,
      valueFormatter: (params) => params.value.ID,
    },
    {
      field: "ReceiptSum",
      headerName: "Net Total (THB)",
      width: 150,
      valueFormatter: (params) => params.value.ReceiptSum,
    },
    {
      field: "Paymenttype",
      headerName: "Payment Method",
      width: 140,
      valueFormatter: (params) => params.value.Paymenttype,
    },
    {
      field: "Member",
      headerName: "Client",
      width: 150,
      valueFormatter: (params) => params.value.FirstName + " " + params.value.LastName,
    },
    {
      field: "ReceiptPaymentAmount",
      headerName: "Received(THB)",
      width: 150,
      valueFormatter: (params) => params.value.ReceiptPaymentAmount,
    },
    {
      field: "Employee",
      headerName: "Cashier",
      width: 150,
      valueFormatter: (params) => params.value.FirstName + " " + params.value.LastName,
    },
    {
      field: "ReceiptTime",
      headerName: "Time Issued",
      width: 300,
      valueFormatter: (params) => params.value.ReceiptTime,
    },
  ];

  return (
    <div>
      <Paper>
        <Box
          display="flexr"
          sx={{
            marginTop: 2,
          }}
        ><Box sx={{ paddingX: 1, paddingY: 1, }}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >RECEIPT RECORDS
            </Typography>
            <Container maxWidth="xl">
              <div style={{ height: 600, width: "100%", marginTop: "10px" }}>
                <DataGrid
                  rows={receipts}
                  getRowId={(row) => row.ID}
                  columns={columns}
                  pageSize={30}
                  rowsPerPageOptions={[9]}
              /></div>
            </Container>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}export default Receipts;