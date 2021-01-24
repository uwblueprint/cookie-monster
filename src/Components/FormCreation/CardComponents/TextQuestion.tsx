import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import { AnyNaptrRecord } from "dns";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Validation } from "../../../Types/FormTypes";

const Wrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 33px;
  width: 744px;
`;

type Props = {
  submission: boolean;
  short_answer: boolean;
  validation?: AnyNaptrRecord;
  onValidation: (text: Validation) => void;
  onChange: (text: string) => void;
};

//TODO: Add Response Validation
function TextQuestion({
  submission = false,
  short_answer,
  validation,
  onValidation,
  onChange
}: Props): React.ReactElement {
  const [text, setText] = useState("");
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //Check validations here and update the error prop accordingly
    setText(event.target.value);
  };

  const [validationType, setValidationType] = useState("word");
  const [validationLimit, setValidationLimit] = useState("most");
  const [validationCount, setValidationCount] = useState(500);

  const updateValidationType = (valType: string) => {
    // todo
    setValidationType(valType);

    const validation = {
      type: valType.toUpperCase(),
      expression: null,
      max: validationLimit === "most" ? validationCount : 0,
      min: validationLimit === "least" ? validationCount : 0
    };
    onValidation(validation);
  };

  const updateValidationLimit = (valLimit: string) => {
    // todo
    setValidationLimit(valLimit);

    const validation = {
      type: validationType.toUpperCase(),
      expression: null,
      max: valLimit === "most" ? validationCount : 0,
      min: valLimit === "least" ? validationCount : 0
    };
    onValidation(validation);
  };

  const updateValidationCount = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.target.value === "") {
      setValidationCount(0);
    } else {
      setValidationCount(parseInt(event.target.value));

      const validation = {
        type: validationType.toUpperCase(),
        expression: null,
        max: validationLimit === "most" ? parseInt(event.target.value) : 0,
        min: validationLimit === "least" ? parseInt(event.target.value) : 0
      };
      onValidation(validation);
    }
  };

  return (
    <Wrapper>
      <TextField
        disabled={!submission}
        error={false}
        placeholder={short_answer ? "Short answer text" : "Long answer text"}
        size="medium"
        value={text}
        onBlur={() => onChange(text)}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleTextChange(event)
        }
        multiline
        rowsMax={short_answer ? 2 : 4}
        fullWidth={true}
      ></TextField>
      {validation && !short_answer ? (
        <div>
          <Select
            defaultValue="word"
            style={{ width: "150px", marginRight: "20px", marginTop: "20px" }}
          >
            <MenuItem value="word" onClick={() => updateValidationType("word")}>
              Word count
            </MenuItem>
            <MenuItem value="char" onClick={() => updateValidationType("char")}>
              Character count
            </MenuItem>
          </Select>
          <Select
            defaultValue="most"
            style={{ width: "100px", marginRight: "20px", marginTop: "20px" }}
          >
            <MenuItem
              value="most"
              onClick={() => updateValidationLimit("most")}
            >
              At most
            </MenuItem>
            <MenuItem
              value="least"
              onClick={() => updateValidationLimit("least")}
            >
              At least
            </MenuItem>
          </Select>
          <TextField
            value={validationCount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateValidationCount(event)
            }
            style={{ width: "50px", marginRight: "20px", marginTop: "20px" }}
          />
        </div>
      ) : null}
    </Wrapper>
  );
}

export default TextQuestion;
