import React, { useReducer, useState, useContext } from "react";
import { AuthContext } from "../../Authentication/Auth.js";
import styled from "styled-components";
import ErrorIcon from "@material-ui/icons/Error";
import Button from "@material-ui/core/Button";
import Dialog from "../Common/Dialogs/Dialog";
import DialogHeader from "../Common/Dialogs/DialogHeader";
import Snackbar from "@material-ui/core/Snackbar";
import LoadingOverlay from "../Common/LoadingOverlay";
import { userFormStateReducer } from "../../Reducers/UserFormStateReducer";
import EditUserForm from "./EditUserForm";
import DeleteUser from "./DeleteUser";
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
  button {
    text-transform: none;
  }
`;

// onAddNewUser: callback for when a new user is added
function EditUserDialog({ close, data, programId, onlyAdminUser }) {
  const initialFormState = {
    name: data.name,
    email: data.email,
    role: data.role
  };

  const [formState, dispatchUpdateFormState] = useReducer(
    userFormStateReducer,
    initialFormState
  );

  const [showSaveFailure, setShowSaveFailure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { appUser } = useContext(AuthContext);

  function updateUser() {
    setIsSubmitting(true);
    const requestBody = {
      role: formState.role
    };
    UPDATE.updateUserProgramRoleAPI(programId, data.userId, requestBody)
      .then(() => {
        close();
        window.location.reload();
      })
      .catch(() => {
        setIsSubmitting(false);
        setShowSaveFailure(true);
      });
  }

  const handleSnackbarClose = () => {
    setShowSaveFailure(false);
  };

  return (
    <Dialog
      width={400}
      maxHeight="70%"
      paddingHorizontal={28}
      paddingVertical={28}
    >
      <DialogHeader onClose={close} title="Edit user" />
      <LoadingOverlay
        show={isSubmitting}
        spinnerProps={{
          radius: 120,
          stroke: 2
        }}
      />
      <EditUserForm
        formState={formState}
        dispatch={dispatchUpdateFormState}
        onlyAdminUser={onlyAdminUser}
      />
      {appUser.userId !== data.userId ? (
        <DeleteUser
          close={close}
          userId={data.userId}
          setShowSaveFailure={setShowSaveFailure}
          setIsSubmitting={setIsSubmitting}
          programId={programId}
        />
      ) : null}
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
    </Dialog>
  );
}

export default EditUserDialog;
