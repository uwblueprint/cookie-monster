import React from "react";
import styled from "styled-components";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Link from "@material-ui/core/Link";

const Wrapper = styled.div`
  width: 100%;
  text-align: left;
`;

const CategoryWrapper = styled.div`
  font-size: 14px;
  width: 100%;
  .category {
    display: grid;
    grid-template-columns: 200px auto;
    margin: 15px 0;
    line-height: 20px;
  }
  .title {
    font-weight: 500;
  }
  .value {
    font-weight: normal;
    text-align: right;
  }
`;

const SecondaryExpansionPanel = withStyles({
  root: {
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 0
    }
  },
  expanded: {},
})(ExpansionPanel);

const SecondarySummaryPanel = withStyles({
  root: {
    minHeight: 0,
    padding: 0,
    margin: 0,
    display: "inline-flex",
    color: "#888888",
    fontSize: 15,
    textTransform: "uppercase",
    '&$expanded': {
      minHeight: 0
    }
  },
  content: {
    margin: 0,
    '&$expanded': {
      margin: 0
    }
  },
  expandIcon: {
    padding: 8
  },
  expanded: {},
})(ExpansionPanelSummary);

const useStyles = makeStyles({
  mainDetailsPanel: {
    display: "block"
  },
  secondaryDetailsPanel: {
    padding: 0
  },
  mainSummaryPanel: {
    margin: 0,
    fontWeight: 500,
    fontSize: 20
  }
});

const Categories = ({ categoryData }) => {
  const {contact, socialMedia, organizationInformation, applicationInformation} = categoryData;
  const classes = useStyles();

  return (
    <Wrapper>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          classes={{ root: classes.mainSummaryPanel }}
        >
          Administrative Categories
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: classes.mainDetailsPanel }}>

          <SecondaryExpansionPanel>
            <SecondarySummaryPanel expandIcon={<ExpandMoreIcon />}>
              Contact
            </SecondarySummaryPanel>
            <ExpansionPanelDetails classes={{ root: classes.secondaryDetailsPanel }}>
              <CategoryWrapper>
                {contact.map(({ title, value }, index) => (
                  <div className="category" key={index}>
                    {title != "Organization Website" ? (
                      <>
                      <span className="title">{title}</span>
                      <span className="value">{value}</span>
                      </>
                    )
                    : (
                      <>
                      <span className="title">{title}</span>
                      <span className="value">
                          <Link target="_blank" href={value}> {value} </Link>
                      </span>
                      </>
                    )
                  }
                  </div>
                ))}
              </CategoryWrapper>
            </ExpansionPanelDetails>
          </SecondaryExpansionPanel>

          <SecondaryExpansionPanel>
            <SecondarySummaryPanel expandIcon={<ExpandMoreIcon />}>
              Social Media
            </SecondarySummaryPanel>
            <ExpansionPanelDetails classes={{ root: classes.secondaryDetailsPanel }}>
              <CategoryWrapper>
                {socialMedia.map(({ title, value }, index) => (
                  <div className="category" key={index}>
                    <span className="title">{title}</span>
                    <span className="value">
                      <Link href={value}> {value} </Link>
                    </span>
                  </div>
                ))}
              </CategoryWrapper>
            </ExpansionPanelDetails>
          </SecondaryExpansionPanel>

          <SecondaryExpansionPanel>
            <SecondarySummaryPanel expandIcon={<ExpandMoreIcon />}>
              Organization Information
            </SecondarySummaryPanel>
            <ExpansionPanelDetails classes={{ root: classes.secondaryDetailsPanel }}>
              <CategoryWrapper>
                {organizationInformation.map(({ title, value }, index) => (
                  <div className="category" key={index}>
                    <span className="title">{title}</span>
                    <span className="value">{value}</span>
                  </div>
                ))}
              </CategoryWrapper>
            </ExpansionPanelDetails>
          </SecondaryExpansionPanel>

          <SecondaryExpansionPanel>
            <SecondarySummaryPanel expandIcon={<ExpandMoreIcon />}>
              Application Information
            </SecondarySummaryPanel>
            <ExpansionPanelDetails classes={{ root: classes.secondaryDetailsPanel }}>
              <CategoryWrapper>
                {applicationInformation.map(({ title, value }, index) => (
                  <div className="category" key={index}>
                    <span className="title">{title}</span>
                    <span className="value">{value}</span>
                  </div>
                ))}
              </CategoryWrapper>
            </ExpansionPanelDetails>
          </SecondaryExpansionPanel>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Wrapper>
  );
};

export default Categories;
