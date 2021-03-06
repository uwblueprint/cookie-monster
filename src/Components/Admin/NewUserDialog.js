import React, { useReducer, useState } from "react";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import EditUserForm from "./EditUserForm";
import LoadingOverlay from "../Common/LoadingOverlay";
import Dialog from "../Common/Dialogs/Dialog";
import DialogHeader from "../Common/Dialogs/DialogHeader";
import { userFormStateReducer } from "../../Reducers/UserFormStateReducer";
import { createOrAddUserProgramAPI } from "../../requests/update";
import * as userRoles from "../../Constants/UserRoles";

const Wrapper = styled.div`
  .invitationButton {
    text-transform: none;
  }
`;

const initialFormState = {
  email: "",
  role: userRoles.REVIEWER
};

// onAddNewUser: callback for when a new user is added
function NewUserDialog({ onSubmit, close, confirm, programId }) {
  const [formState, dispatchUpdateFormState] = useReducer(
    userFormStateReducer,
    initialFormState
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function addNewUser() {
    setIsSubmitting(true);
    try {
      const data = { ...formState };
      const user = await createOrAddUserProgramAPI(programId, {
        email: data.email,
        role: data.role
      }).then(() => {
        close();
        window.location.reload();
        onSubmit && onSubmit(user);
        confirm();
      });
    } catch (e) {
      console.error(e);
      if (e.message) {
        // error message set on new user creation in backend
        alert(e.message);
      } else {
        alert("Something went wrong. User created unsuccessfully.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <Wrapper>
      <Dialog width="400px" paddingHorizontal={28} paddingVertical={28}>
        <DialogHeader onClose={close} title="Add a new user" />
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
          newUser={true}
        />
        <Button
          className="invitationButton"
          onClick={addNewUser}
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          Send invitation
        </Button>
      </Dialog>
    </Wrapper>
  );
}

export default NewUserDialog;
