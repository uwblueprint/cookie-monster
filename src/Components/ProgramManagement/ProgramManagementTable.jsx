import React from "react";
import styled from "styled-components";
import MaterialTable from "material-table";
import TableIcons from "../Common/TableIcons";
import { Paper } from "@material-ui/core";

const Container = styled(Paper)`
  table {
    border: 1px solid #cccccc;
    margin-bottom: 48px;
  }
`;

const rowStyle = {
  border: "1px solid #cccccc"
};

const columnStyle = {
  width: "100%"
};

const columns = [
  {
    title: "Program name",
    field: "name",
    cellStyle: { minWidth: 300, maxHeight: 52 },
    headerStyle: { minWidth: 300 }
  },
  {
    title: "Organization",
    field: "organization"
  },
  { title: "Role", field: "role" },
  {
    title: "",
    field: "link",
    sorting: false,
    searchable: false,
    export: false,
    cellStyle: {
      textAlign: "right",
      minWidth: 148
    }
  },
  {
    title: "",
    field: "options",
    sorting: false,
    searchable: false,
    export: false,
    cellStyle: {
      textAlign: "right",
      maxWidth: 20
    }
  }
];

function ProgramManagementTable({ ...props }) {
  return (
    <div>
      <MaterialTable
        icons={TableIcons}
        components={{
          Container: (props) => <Container {...props} elevation={0} />
        }}
        columns={columns}
        {...props}
        options={{
          pageSize: Math.min(5, props.data.length),
          rowStyle: rowStyle,
          columnStyle: columnStyle,
          search: true,
          showTitle: false,
          paging: false
        }}
      />
    </div>
  );
}

export default ProgramManagementTable;
