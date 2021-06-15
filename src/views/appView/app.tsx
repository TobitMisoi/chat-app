/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import { BottomBar, TopBar as SideTopBar, Search } from "../../components";
import {
  MainTopBar,
  MessageInput,
  Messages,
  OnBoard,
} from "../../components/Main";
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

  const fetchMesages = async (gid = currGroup?._id) => {
    if (!gid) return;
    console.log("GID",gid);

    let resp;

    try {
      resp = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/groups/60be5c3a6fc2bfdc0467a490`
      );
    } catch (err) {
      console.log("[EROR][MESSAGES][FETCH]", err);
      setSnack({
        open: true,
        severity: "error",
        message: "An error occured: Could not fetch messages and members",
      });
      setLoading(false);
      return;
    }

    console.log(resp.data);

    // if (resp.data) {
    //   setSnack({
    //     open: true,
    //     severity: "error",
    //     message: "An error occured: Could not fetch messages and members",
    //   });
    // }

    // // dispatch data
    // dispatch({
    //   type: "FETCH MESSAGES",
    //   payload: resp.data.messages,
    //   members: resp.data.members,
    // });
  };

  React.useEffect(() => {
    if (!socket) return;
    socket.emit("join group", userData.id, currGroup?._id);

    fetchMesages();
  }, [currGroup]);

  React.useEffect(() => {
    const sct = io(process.env.REACT_APP_SOCKET_URL!, {
      transports: ["websocket"],
    });

    sct.emit("new user", userData.id);
    sct.on("fetch messages", (id: string) => fetchMesages(id));
    sct.on("fetch group", fetchGroups);
    setSocket(socket);
    fetchGroups();
  }, []);

  // creating messages
  const createMessage = async (text: string, date: string) => {
    if (!socket) return;

    let resp;
    try {
      resp = await axios.post(`${process.env.REACT_APP_SERVER_URL}/messages`, {
        gid: currGroup?._id,
        text,
        username: userData.username,
        image: userData.image,
        uid: userData.id,
        date,
      });
    } catch (err) {
      console.log("[ERROR][GROUPS][CREATE]", err);
      setSnack({
        open: true,
        severity: "error",
        message: "An error occured: Could not send message",
      });
      return;
    }
    if (!resp) return;
    socket?.emit("message", userData.id, currGroup?._id);
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
      verifiedToken = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/verify`,
        {
          id,
          token,
        }
      );
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
      resp = await axios.post(`${process.env.REACT_APP_SERVER_URL}/groups`, {
        title,
        description: description ? description : "No description",
      });
    } catch (err) {
      console.log("[ERROR][AUTH][GROUPS][CREATE] :", err);
      setSnack({
        open: true,
        severity: "error",
        message: "An error occured: Could not create group.",
      });
      return;
    }

    if (!resp) return;
    dispatch({ type: "MODAL", payload: { modal: null } });
    fetchGroups();
    socket?.emit("create group", userData.id, title);
    setSnack({
      open: true,
      severity: "error",
      message: `${title} channel created`,
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
        <MessageInput
          sendClick={createMessage}
          onClick={() => setMobile(false)}
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
        <MainTopBar title="" menuClick={() => setMobile(true)} />
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
      verifiedToken = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/verify`,
        {
          id,
          token,
        }
      );
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
      resp = await axios.put(`${process.env.REACT_APP_SERVER_URL}/users/edit`, {
        username,
        image,
        id,
      });
    } catch (err) {
      console.log("[ERROR][USERS][EDIT] ", err);
      setSnack({
        open: true,
        severity: "error",
        message: "An error occured: Could not edit profile",
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

  const fetchGroups = async () => {
    let resp;

    try {
      resp = await axios.get(`${process.env.REACT_APP_SERVER_URL}/groups`);
    } catch (err) {
      console.log("[ERROR][FETCH][GROUPS]:", err);
      setSnack({
        open: true,
        severity: "error",
        message: "An error occured: Could not fetch groups",
      });
    }
    if (!resp) return;

    dispatch({
      type: "FETCH GROUPS",
      payload: { displayedGroups: resp.data.groups, groups: resp.data.groups },
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
      dispatch({
        type: "CHANGE GROUP",
        payload: { currGroup: current[0] },
      });
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
        <Modal onCreate={createGroup} title="New Channel" />
      )}
      {modal === "edit" && <EditProfile onEdit={editProfileRequest} />}
      {modal === "bug" && (
        <Modal title="Report bug" onCreate={() => console.log("report bug")} />
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
          variant="filled"
          severity={snack.severity}
          onClose={() => {
            setSnack({
              open: false,
              severity: snack.severity,
              message: null,
            });
            return;
          }}
        >
          {snack.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default AppView;
