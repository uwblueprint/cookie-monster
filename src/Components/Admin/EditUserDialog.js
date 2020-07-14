import React, { useReducer, useState } from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import LoadingOverlay from "../Common/LoadingOverlay";
import { userFormStateReducer } from "../../Reducers/UserFormStateReducer";
import EditUserForm from "./EditUserForm";
import DeleteUser from "./DeleteUser";
import { Wrapper, Header } from "./DialogWrappers";
import * as UPDATE from "../../requests/update";

const SaveFailure = styled.div`
  p {
    display: inline-block;
    color: #ffffff;
    margin-left: 12px;
    margin-right: 12px;
  }
  background-color: #333333;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
`;

const SaveWrapper = styled.div`
  position: relative;
`;

const useStyles = makeStyles({
  closeRoot: {
    display: "inline-block",
    marginLeft: "auto"
  }
});

// onAddNewUser: callback for when a new user is added
function EditUserDialog({ close, data }) {
  const initialFormState = {
    name: data.name,
    preferredName: data.preferredName,
    email: data.email,
    role: data.role,
    programs: new Set(data.programs.map((p) => p.name))
  };

  const [formState, dispatchUpdateFormState] = useReducer(
    userFormStateReducer,
    initialFormState
  );

  const [showSaveFailure, setShowSaveFailure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = useStyles();

  function updateUser() {
    setIsSubmitting(true);
    const requestBody = {
      userId: data.userId,
      name: formState.name,
      preferredName: formState.preferredName,
      email: formState.email,
      role: formState.role,
      programs: Array.from(formState.programs).map((p) => ({
        name: p,
        access: "regular user"
      }))
    };
    UPDATE.updateUserAPI(requestBody)
      .then((response) => {
        console.log(response);
        close();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setIsSubmitting(false);
        setShowSaveFailure(true);
      });
  }

  const handleSnackbarClose = () => {
    setShowSaveFailure(false);
  };

  return (
    <Wrapper>
      <Header>
        <h4>Edit existing user</h4>
        <IconButton
          onClick={close}
          classes={{ root: styles.closeRoot }}
          size="small"
        >
          <Close />
        </IconButton>
      </Header>
      <LoadingOverlay
        show={isSubmitting}
        spinnerProps={{
          radius: 120,
          stroke: 2
        }}
      />
      <EditUserForm formState={formState} dispatch={dispatchUpdateFormState} />
      <DeleteUser
        close={close}
        userId={data.userId}
        setShowSaveFailure={setShowSaveFailure}
        setIsSubmitting={setIsSubmitting}
      />
      <SaveWrapper>
        <Button
          onClick={() => updateUser()}
          fullWidth
          variant="contained"
          color="primary"
        >
          Save changes
        </Button>
        <Snackbar
          open={showSaveFailure}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          style={{
            position: "absolute",
            bottom: 0,
            minWidth: "max-content"
          }}
        >
          <SaveFailure>
            <ErrorIcon style={{ fill: "#FFFFFF", marginLeft: "12px" }} />
            <p>Failed to save changes, please try again!</p>
          </SaveFailure>
        </Snackbar>
      </SaveWrapper>
    </Wrapper>
  );
}

export default EditUserDialog;