import React, { useEffect, useMemo, useState, useRef, useContext } from "react";
import { Redirect } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core";
import RankingCard from "./RankingCard";
import usePromise from "../../Hooks/usePromise";
import { getAllStackingsAPI, getReviewCountAPI } from "../../requests/get";
import { updateStackedAPI } from "../../requests/update";
import { reorder } from "../../Utils/dragAndDropUtils";
import { ProgramContext } from "../../Contexts/ProgramContext";
import { AuthContext } from "../../Authentication/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const CARD_HEIGHT = 56;
const CARD_SPACING = 12;

const maxWidth = "100%";

const useStyles = makeStyles({
  rankings: {
    display: "flex",
    position: "relative"
  },
  root: {
    marginTop: 100,
    padding: "0 168px",
    textAlign: "left",
    "& h1": {
      fontSize: 24,
      fontWeight: "normal"
    },
    "& p": {
      color: "#888888",
      fontSize: 14,
      marginBottom: 20
    }
  },
  cutoff: {
    height: 0,
    fontSize: 10,
    position: "relative",
    overflow: "visible",
    "& div": {
      textAlign: "right",
      letterSpacing: 1.5,
      color: "#FF0000",
      fontWeight: 500,
      textTransform: "uppercase",
      position: "absolute",
      top: -10,
      right: 0
    }
  },
  divider: {
    height: 0,
    position: "relative",
    overflow: "visible",
    "& div": {
      position: "absolute",
      maxWidth: maxWidth,
      left: 0,
      right: 0,
      bottom: 4,
      borderTop: "2px dashed #FF0000"
    }
  },
  translateDivider: {
    transform: `translate(0, ${CARD_HEIGHT + CARD_SPACING}px)`
  },
  draggableCard: {
    marginBottom: 12,
    maxWidth: maxWidth,
    minWidth: 300,
    textAlign: "center"
  },
  droppableSection: {
    display: "inline-block",
    flexGrow: 1
  }
});

const RankNumber = styled.div`
  font-weight: bold;
  height: ${CARD_HEIGHT}px;
  line-height: ${CARD_HEIGHT}px;
  margin-bottom: ${CARD_SPACING}px;
  text-align: right;
`;

const NumbersColumn = styled.div`
  display: inline-block;
  font-size: 20px;
  padding-right: 30px;
  position: absolute;
  right: 100%;
`;

function compare(a, b) {
  if (a.rating < b.rating) {
    return 1;
  }
  if (a.rating > b.rating) {
    return -1;
  }
  return 0;
}

function getValidRankings(fetchedRankings, applications) {
  const applicationIdSet = new Set(applications.map((app) => app._id));
  return fetchedRankings.filter((rank) => applicationIdSet.has(rank._id));
}

async function createUpdateMissingRankings(
  existingRankings,
  user,
  applications
) {
  const existingReviewsIds = new Set(existingRankings.map((app) => app._id));
  const missingApps = applications.reduce((arr, app) => {
    !existingReviewsIds.has(app._id) && arr.push({ appId: app._id });
    return arr;
  }, []);
  const updatedApps = [...existingRankings, ...missingApps];
  try {
    await updateStackedAPI({
      userId: user.userId,
      rankings: updatedApps
    });
    const sortedNewRankings = await getAllStackingsAPI({ user });
    if (existingRankings.length === 0) {
      // Should sort on initial creation.
      sortedNewRankings.sort(compare);
    }
    await updateStackedAPI({
      userId: user.userId,
      rankings: sortedNewRankings.map((app) => ({ appId: app._id }))
    });
  } catch (e) {
    console.error("Unable to initialize stacked rankings: " + e);
  }
}

function StackedRankings({ history }) {
  const { appUser: user } = useContext(AuthContext);
  const { applications } = useContext(ProgramContext);
  const [fetchedRankings, refetch] = usePromise(getAllStackingsAPI, { user });
  const [reviewCount] = usePromise(getReviewCountAPI, user.userId);
  const [rankings, setRankings] = useState([]);
  const shouldTranslate = useRef(false);
  const classes = useStyles();

  useEffect(() => {
    async function fillInRankings(existingRankings) {
      await createUpdateMissingRankings(existingRankings, user, applications);
      refetch({ user });
    }
    // Load rankings
    if (fetchedRankings.isPending) return;
    const updatedRankings = getValidRankings(
      fetchedRankings.value,
      applications
    );
    if (updatedRankings.length !== applications.length) {
      fillInRankings(updatedRankings);
      return;
    }
    setRankings(
      updatedRankings.map((rank) => ({
        ...rank,
        name:
          rank["Organization Name (legal name)"] || rank["Organization Name"]
      }))
    );
  }, [fetchedRankings, applications, user, refetch]);

  const numOrgs = rankings.length;
  const column = useMemo(() => {
    const numbers = [];
    for (let i = 0; i < numOrgs; ++i) {
      numbers.push(
        <React.Fragment key={i}>
          <RankNumber>{i + 1}</RankNumber>
        </React.Fragment>
      );
    }
    return <NumbersColumn>{numbers}</NumbersColumn>;
  }, [numOrgs]);

  const shouldRedirect =
    !reviewCount.value || reviewCount.value < applications.length;

  if (shouldRedirect && !reviewCount.isPending) {
    return <Redirect to="/" />;
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    shouldTranslate.current = false;
    if (!result.destination) {
      return;
    }
    const before = rankings;
    const reorderedList = reorder(
      rankings,
      result.source.index,
      result.destination.index
    );
    try {
      setRankings(reorderedList);
      updateStackedAPI({
        userId: user.userId,
        rankings: reorderedList.map((app) => ({ appId: app._id }))
      });
    } catch (e) {
      setRankings(before);
      console.error(e);
      // TODO error message
      window.alert("Unable to update stacked rankings.");
    }
  };
  const onBeforeDragStart = (provided) => {
    if (provided.source.index <= 4) {
      shouldTranslate.current = true;
    }
  };

  const routeAllCandidates = () => {
    history.push("/applications");
  };

  return (
    <div className={classes.root}>
      <div className={classes.allCandidatesRef}>
        <p align="left" onClick={routeAllCandidates}>
          <span style={{ cursor: "pointer", color: "#2261AD" }}>
            <FontAwesomeIcon
              style={{
                height: "25px",
                width: "25px",
                verticalAlign: "-0.5em",
                color: "#2261AD"
              }}
              icon={faAngleLeft}
            />
            Back to All Candidates
          </span>
        </p>
      </div>
      <h1>Stacked Rankings</h1>
      <p>
        Stacked Rankings are based on your overall ratings. You can move
        applicants around in your order of preference.
      </p>
      <p>Your rankings will be saved automatically.</p>
      <div className={classes.rankings}>
        {column}
        <DragDropContext
          onBeforeDragStart={onBeforeDragStart}
          onDragEnd={onDragEnd}
        >
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                className={classes.droppableSection}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {rankings.map((item, index) => (
                  <React.Fragment key={item._id}>
                    <Draggable draggableId={item._id} index={index}>
                      {(provided) => (
                        <div
                          className={classes.draggableCard}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <RankingCard
                            appId={item._id}
                            companyName={
                              item["Organization Name (legal name)"] ||
                              item["Organization Name"]
                            }
                            rating={item.rating}
                            suggested={item.suggested}
                          />
                        </div>
                      )}
                    </Draggable>
                  </React.Fragment>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default StackedRankings;
