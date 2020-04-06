import React, { useEffect, useState } from "react";
import UserManagementTable from "./UserManagementTable";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import Spinner from 'react-spinner-material';
const GET = require("../../requests/get");

const Wrapper = styled.div`
  margin-top: 148px;
  text-align: left;
  padding: 0 64px;
  .header {
    display: flex;
    align-items: center;
    h1 {
      font-size: 24px;
      font-weight: normal;
      font-size: 24px;
      display: inline-block;
      margin-right: auto;
    }
    .button-container {
      display: inline-block;
    }
    button {
      height: fit-content;
      margin-top: auto;
      margin-bottom: auto;
    }
  }
`;

// Moock data
const users2 = new Array(30).fill(0).map((elem, index) => ({
  name: `${index} blah blah`,
  email: "blah.com",
  role: "Admin",
  programAccess: ["SVP Investee Grant", "SVP Teens", "another"],
  userLink: (
    <Button variant="outlined" color="primary">
      Edit
    </Button>
  )
}));

function UserManagement() {

  const [users, setUsers ] = useState(null);

  useEffect(() => {


    //Option 1
    /*
    GET.getAllUsersAPI().then(res => {
      if (Array.isArray(res)) setUsers(res);
    });
    */


    //Option 2: Define an async function to call at the end of useEffect
    async function getUsers(){

      //Fetch the users from the backend
      let fetched = await GET.getAllUsersAPI()

      //Convert data into a format used by the table using convertData
      //Update the state and re-render
      setUsers(convertData(fetched))
    }


    //Call the defined async function
    getUsers();

  }, []);


  return (
    <div>
    { users != null ? (
      <Wrapper>
        <div className="header">
          <h1>User Management</h1>
          <div className="button-container">
            <Button color="primary" variant="contained">
              Create New User
            </Button>
          </div>
        </div>
        <UserManagementTable data={users} />
      </Wrapper>
    ) : (
      <div>
        <h1>Loading Users...</h1>
        <Spinner radius={120} color={"#333"} stroke={2} visible={true} />
      </div>
    )
  }
  </div>
  );
}


//Helper Function
function convertData(fetched) {
  let userList = []
  if (fetched != null) {
    fetched.forEach(user => {
      let programs = []
      if (user.programs != null){
        user.programs.forEach(program => {
          programs.push(program.name)
        })
      }
      userList.push({
        name: user.name,
        email: user.email,
        programAccess: programs,
        role: "none",
        userLink: (
          <Button variant="outlined" color="primary">
            Edit
          </Button>
        )
      })
    })
  }
  return userList;
}
export default UserManagement;
