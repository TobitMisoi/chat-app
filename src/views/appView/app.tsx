/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient, { Socket } from "socket.io-client";
import { BottomBar, TopBar as SideTopBar, Search } from "../../components";
import { MainTopBar, Messages, OnBoard } from "../../components/Main";
import { Modal, EditProfile } from "../../components/shared/";
import GroupInfo from "../../components/side/groupInfo/groupInfo";
import Groups from "../../components/side/groups/groups";
import Members from "../../components/side/members/members";
import { IRootState } from "./interface";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import styles from "./styles.module.scss";
import { GroupData, SnackData } from "./types";
import axios from "axios";
import { apiConfig } from "../../config/api";

const AppView: React.FC = () => {
  const [mobile, setMobile] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [snack, setSnack] = React.useState<SnackData>({
    open: false,
    severity: undefined,
    message: null,
  });
  const [socket, setSocket] = React.useState<Socket | null>(null);

  const dispatch = useDispatch();

  const userData = useSelector((state: IRootState) => state.auth);
  const { inChannel, currGroup, members, messages, groups, modal } =
    useSelector((state: IRootState) => state.app);

  const fetchGroups = async () => {
    let resp;

    try {
      resp = await axios.get(`${apiConfig.url}/groups`);
    } catch (err) {
      console.log(err);
    }
    if (!resp) return;
    console.log(resp.data.groups);

    dispatch({
      type: "FETCH GROUPS",
      payload: { displayedGroups: resp.data.groups, groups: resp.data.groups },
    });
  };

  // creating a group
  const createGroup = async (title: string, description: string) => {
    const { token, id } = userData;

    if (!token) {
      setSnack({
        open: true,
        severity: "error",
        message: "Guests are not are allowed to create group, please register",
      });
      return;
    }

    let verifiedToken;
    try {
      verifiedToken = await axios.post(`${apiConfig.url}/users/verify`, {
        id,
        token,
      });
    } catch (err) {
      console.log("[ERROR][AUTH][VERIFY] :", err);
      return;
    }

    if (!verifiedToken.data.access) {
      localStorage.removeItem("userData");
      return;
    }

    let resp;
    try {
      resp = await axios.post(`${apiConfig.url}/groups`, {
        title,
        description: description ? description : "No description",
      });
    } catch (err) {
      console.log("[ERROR][AUTH][GROUPS][CREATE] :", err);
      setSnack({
        open: true,
        severity: "error",
        message: "An error occurred: Could not create group.",
      });
      return;
    }

    if (!resp) return;
    dispatch({ type: "MODAL", payload: { modal: null } });
    fetchGroups();
    socket?.emit("create group", userData.id, title);
    setSnack({
      open: true,
      severity: "success",
      message: `${title} channel created.`,
    });
  };

  // Render
  let sideContent;
  let mainContent;

  if (inChannel) {
    sideContent = (
      <div className={styles.sideContent}>
        <GroupInfo currGroup={currGroup} />
        <Members members={members} loading={loading} />
      </div>
    );
    mainContent = (
      <div className={styles.main}>
        <MainTopBar
          title={currGroup?.title}
          menuClick={() => setMobile(true)}
        />
        <Messages
          onClick={() => setMobile(false)}
          loading={loading}
          messages={messages}
        />
      </div>
    );
  } else {
    sideContent = (
      <div className={styles.sideContent}>
        <Search groups={groups} update={() => console.log("update")} />
        <Groups groups={groups} groupClick={(id) => groupHandler(id)} />
      </div>
    );
    mainContent = (
      <div className={styles.main}>
        <MainTopBar title='' menuClick={() => setMobile(true)} />
        <OnBoard onClick={() => setMobile(false)} />
      </div>
    );
  }

  const editProfileRequest = async (username: string, image: string) => {
    const { id, token } = userData;

    if (!token) {
      setSnack({
        open: true,
        severity: "error",
        message: `Guests are not allowed to edit profile, please register`,
      });
      return;
    }

    let verifiedToken;
    try {
      verifiedToken = await axios.post(`${apiConfig.url}/users/verify`, {
        id,
        token,
      });
    } catch (err) {
      console.log("[ERROR][AUTH][VERIFY]: ", err);
      return;
    }

    // if access from req is false then:
    if (!verifiedToken.data.access) {
      localStorage.removeItem("userData");
      return;
    }

    let resp;
    try {
      resp = await axios.put(`${apiConfig.url}/users/edit`, {
        id,
        username,
        image,
      });
    } catch (err) {
      console.log("[ERROR][USERS][EDIT] ", err);
      setSnack({
        open: true,
        severity: "error",
        message: "An error occurred: Could not edit profile",
      });
      return;
    }

    if (!resp) return;

    setSnack({ open: true, severity: "success", message: "Profile updated" });
    dispatch({
      type: "MODAL",
      payload: { modal: null },
    });
    console.log(resp);
    dispatch({
      type: "EDIT",
      payload: {
        username: resp.data.user.username,
        image: resp.data.user.image,
      },
    });
  };

  React.useEffect(() => {
    const socket = socketIOClient(`${apiConfig.socketUrl}`!, {
      transports: ["websocket"],
    });
    socket.emit("new user", userData.id);
    socket.on("fetch messages", (id: string) => fetchMessages(id));
    socket.on("fetch group", fetchGroups);
    setSocket(socket);
    fetchGroups();
  }, []);

  React.useEffect(() => {
    if (!socket) return;
    socket.emit("join group", userData.id, currGroup?._id);

    fetchMessages();
  }, [currGroup]);

  const fetchMessages = async (gid = currGroup?._id) => {
    if (!gid) return;

    let resp;
    try {
      resp = await axios.get(`${apiConfig.url}/groups/${gid}`);
    } catch (error) {
      console.log("[ERROR][MESSAGES][FETCH]: ", error);
      setSnack({
        open: true,
        severity: "error",
        message: `An error occurred: Could not fetch messages and members.`,
      });
      setLoading(false);
      return;
    }

    setLoading(false);
    if (resp.data.error) {
      setSnack({
        open: true,
        severity: "error",
        message: `An error occurred: Could not fetch messages and members.`,
      });
      return;
    }

    dispatch({
      type: "FETCH MESSAGES",
      payload: { messages: resp.data.messages, members: resp.data.members },
    });
  };

  // Handlers
  const logoutHandler = () => {
    socket?.disconnect();
    localStorage.removeItem("userData");
    dispatch({ type: "LOGOUT" });
  };
  const groupHandler = (id: string) => {
    setLoading(true);
    const current = groups.filter((item: GroupData) => item._id === id);
    if (current.length > 0) {
      dispatch({ type: "GROUP", payload: { currGroup: current[0] } });
    }
  };

  return (
    <div className={styles.container}>
      <div className={mobile ? styles.mobile : styles.side}>
        <SideTopBar
          arrowClick={() => {
            dispatch({ type: "EXIT" });
          }}
          plusClick={() => {
            dispatch({ type: "MODAL", payload: { modal: "create" } });
            setMobile(false);
          }}
          inChannel={inChannel}
        />
        {sideContent}
        <BottomBar
          profileClick={() => {
            dispatch({ type: "MODAL", payload: { modal: "edit" } });
            setMobile(false);
          }}
          bugClick={() => {
            dispatch({ type: "MODAL", payload: { modal: "bug" } });
            setMobile(false);
          }}
          exitClick={logoutHandler}
        />
      </div>
      {mainContent}

      {modal === "create" && (
        <Modal onCreate={createGroup} title='New Channel' />
      )}
      {modal === "edit" && <EditProfile onEdit={editProfileRequest} />}
      {modal === "bug" && (
        <Modal title='Report bug' onCreate={() => console.log("report bug")} />
      )}
      <Snackbar
        open={snack.open}
        onClose={() =>
          setSnack({
            open: false,
            severity: snack.severity,
            message: null,
          })
        }
        autoHideDuration={5000}
      >
        <MuiAlert
          variant='filled'
          severity={snack.severity}
          onClose={() =>
            setSnack({
              open: false,
              severity: snack.severity,
              message: null,
            })
          }
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default AppView;
