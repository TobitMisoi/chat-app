/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createMuiTheme,
  ThemeProvider,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../customButton/customButton";
import styles from "./styles.module.scss";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

interface IRootState {
  auth: {
    username: string;
    image: string;
  };
}

interface IRootState {
  auth: {
    username: string;
    image: string;
  };
}

type Props = {
  onEdit: (username: string, image: string) => void;
};

const EditProfile: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const { image, username } = useSelector((state: IRootState) => state.auth);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);
  const [newImage, setImage] = React.useState(image);
  const [newUsername, setUsername] = React.useState(username);
  const [usernameErr, setUsernameErr] = React.useState(false);
  const [usernameHelper, setUsernameHelper] = React.useState("");

  const imgPickerRef = React.useRef<HTMLInputElement>(null);

  const editandler = () => {
    if (usernameErr) {
      setIsValid(false);
      return;
    }

    props.onEdit(newUsername, newImage);
  };

  const usernameHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= 2 || e.target.value.length > 12) {
      setUsernameErr(true);
      setUsernameHelper("Username should contain 3 to 12 characters.");
    } else {
      setUsernameErr(false);
      setUsernameHelper("");
      setIsValid(true);
    }

    setUsername(e.target.value);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={() => dispatch({ type: "MODAL", payload: { modal: null } })}
    >
      <div className={styles.modal}>
        <h2>Profile</h2>
        <ThemeProvider theme={darkTheme}>
          <form
            action=""
            className={styles.form}
            onSubmit={(e) => e.preventDefault()}
          >
            <img
              src={newImage}
              alt="User"
              className={styles.image}
              onClick={() => {
                if (imgPickerRef.current !== null) imgPickerRef.current.click();
              }}
            />
            <input
              type="file"
              accept=".jpg,.png,.jpeg"
              className={styles.file}
              ref={imgPickerRef}
              onChange={() => console.log("upload handler")}
            />
            <TextField
              className={styles.input}
              id="username"
              label="Username"
              variant="outlined"
              helperText={usernameHelper}
              onChange={(e) => usernameHandler(e)}
              error={usernameErr}
              value={newUsername}
            />
            <CustomButton onClick={editandler} isPurple title="Edit" small />
            {!isValid && <p className={styles.error}>Invalid entries.</p>}
            {isLoading && <CircularProgress />}
          </form>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default EditProfile;
