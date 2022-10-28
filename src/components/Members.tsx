import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MemberInterface } from "../interfaces/IMember";
import { GetMembers } from "../services/HttpClientService";
import moment from "moment";



function Members() {
  const [members, setMembers] = useState<MemberInterface[]>([]);

  useEffect(() => {
    getMembers();
  }, []);

  const getMembers = async () => {
    let res = await GetMembers();
    if (res) {
      setMembers(res);
    } 
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ID", width: 50 },
    {
        field: "FirstName",
        headerName: "First Name",
        width: 150,
        valueFormatter: (params) => params.value.FirstName,
    },
    {
        field: "LastName",
        headerName: "Last Name",
        width: 150,
        valueFormatter: (params) => params.value.LastName,
    },
    {
      field: "Age",
      headerName: "Age",
      width: 150,
      valueFormatter: (params) => params.value.Age,
  },
    {
      field: "Gender",
      headerName: "Gender",
      width: 150,
      valueFormatter: (params) => params.value.Gender,
    },
    { field: "Date_Of_Birth", 
      headerName: "Birthday", 
      width: 250 ,
      renderCell:(params) => moment(params.row.Date_Of_Birth).format('YYYY-MM-DD')
    },
    {
      field: "Province",
      headerName: "Province",
      width: 150,
      valueFormatter: (params) => params.value.Name,
    },
    {
      field: "Telephone",
      headerName: "Telephone",
      width: 150,
      valueFormatter: (params) => params.value.Telephone,
    },
    {
      field: "Employee",
      headerName: "Employee",
      width: 150,
      valueFormatter: (params) => params.value.FirstName +"  "+ params.value.LastName,
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
             Member Information
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/members/create"
              variant="contained"
              color="primary"
            >
              Create Member
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={members}
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

export default Members;