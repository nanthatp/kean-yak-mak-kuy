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
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useAutocomplete from '@mui/material/useAutocomplete';



import { EmployeeInterface } from "../interfaces/IEmployee";
import {GendersInterface } from "../interfaces/IGender";
import { ProvinceInterface } from "../interfaces/IProvince";
import { MemberInterface } from "../interfaces/IMember";

import {
  GetEmployeeByEID,
  Members,
} from "../services/HttpClientService";

const apiUrl = "http://localhost:8080";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

async function GetGenders() {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/genders`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });

  return res;
}

async function GetProvinces() {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/provinces`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return false;
      }
    });
  return res;
}

function MemberCreate() {
  const [employees, setEmployees] = useState<EmployeeInterface>();
  const [genders, setGenders] = useState<GendersInterface[]>([]);
  const [provinces, setProvinces] = useState<ProvinceInterface[]>([]);
  const [member, setMember] = useState<MemberInterface>({
    Date_Of_Birth: new Date(),
  });
 

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

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

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof MemberCreate;
    const { value } = event.target;
    setMember({ ...member, [id]: value });
  };

  const handleChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof typeof member;
    setMember({
      ...member,
      [name]: event.target.value,
    });
  };

  const getEmployees = async () => {
    let res = await GetEmployeeByEID();
    member.EmployeeID = res.ID;
    if (res) {
      setEmployees(res);
    }
  };

  const getGenders = async () => {
    let res = await GetGenders();
    if (res) {
      setGenders(res);
    }
  };

  const getProvinces = async () => {
    let res = await GetProvinces();
    if (res) {
      setProvinces(res);
    }
  };

  useEffect(() => {
    getEmployees();
    getGenders();
    getProvinces();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  async function submit() {
    let data = {
        FirstName: member.FirstName ?? "",
        LastName: member.LastName ?? "",
        Age: typeof member.Age === "string" ? parseInt(member?.Age) : 0,
        GenderID: convertType(member?.GenderID),
        Date_Of_Birth: member.Date_Of_Birth,
        ProvinceID: convertType(member.ProvinceID),
        Telephone: member.Telephone ?? "",
        EmployeeID: convertType(member.EmployeeID),
    
    };
    console.log(data)
    let res = await Members(data);
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
              SIGN UP
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <FormControl fullWidth >
              <TextField
                margin="normal"
                required
                id="FirstName"
                type="string"
                size="medium"
                autoFocus
                value={member.FirstName || ""}
                onChange={handleInputChange}
                label="First Name"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth >
              <TextField
                margin="normal"
                required
                id="LastName"
                type="string"
                size="medium"
                autoFocus
                value={member.LastName || ""}
                onChange={handleInputChange}
                label="Last Name"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth >
              <TextField
                margin="normal"
                required
                id="Age"
                type="number"
                size="medium"
                autoFocus
                value={member.Age || ""}
                onChange={handleInputChange}
                label="Age"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth >
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>      
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Gender"
                  native
                  value={member.GenderID + ""}
                  onChange={handleChange}
                  inputProps={{
                    name: "GenderID",
                  }}                
                >
                  <option aria-label="None" value=""></option>
                  {genders.map((item: GendersInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Gender}
                    </option>
                  ))}
                </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <FormControl fullWidth >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Birthbay"
                value={member.Date_Of_Birth}
                onChange={(newValue) => {
                  setMember({
                    ...member,
                    Date_Of_Birth: newValue,
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth >
            <InputLabel id="demo-simple-select-label">Province</InputLabel>      
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Province"
                  native
                  value={member.ProvinceID + ""}
                  onChange={handleChange}
                  inputProps={{
                    name: "ProvinceID",
                  }}                
                >
                  <option aria-label="None" value=""></option>
                  {provinces.map((item: ProvinceInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Name}
                    </option>
                  ))}
                </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth >
              <TextField
                margin="normal"
                required
                fullWidth
                id="Telephone"
                type="string"
                size="medium"
                autoFocus
                value={member.Telephone || ""}
                onChange={handleInputChange}
                label="Telephone Number"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <FormControl fullWidth >
              <InputLabel id="demo-simple-select-label">Employee</InputLabel>      
              <Select
                native
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Employee"                
                value={member.EmployeeID + ""}
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
              to="/members"
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

export default MemberCreate;