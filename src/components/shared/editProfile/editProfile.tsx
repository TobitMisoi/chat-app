/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createTheme,
  ThemeProvider,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import sha1 from "sha1";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiConfig, cloudinaryConfig } from "../../../config/api";
import CustomButton from "../customButton/customButton";
import styles from "./styles.module.scss";

const darkTheme = createTheme({
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

  const editHandler = (newUsername: string, newImage: string) => {
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

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const postImage = async (data: FormData) => {
    setIsLoading(true);

    let resp;
    try {
      resp = await axios.post(`${cloudinaryConfig.url}/image/upload`, data);
    } catch (err) {
      console.log("[ERROR]", err);
      setIsLoading(false);
    }

    if (!resp) return;
    setImage(resp.data.secure_url);
    setIsLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadHandler = (e: any) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("timestamp", Math.floor(Date.now() / 1000).toString());
    formData.append(
      "signature",
      sha1(
        `${cloudinaryConfig.apiKey}${formData.get("timestamp")}${
          cloudinaryConfig.apiSecret
        }`
      )
    );

    postImage(formData);
  };

  return (
    <div
      className={styles.backdrop}
      // onClick={() => dispatch({ type: "MODAL", payload: { modal: null } })}
    >
      <div className={styles.modal}>
        <h2>Profile</h2>
        <ThemeProvider theme={darkTheme}>
          <form action='' className={styles.form} onSubmit={() => handleSubmit}>
            <img
              src={newImage}
              alt='User'
              className={styles.image}
              onClick={() => {
                if (imgPickerRef.current !== null) imgPickerRef.current.click();
              }}
            />
            <input
              type='file'
              accept='.jpg,.png,.jpeg'
              className={styles.file}
              ref={imgPickerRef}
              onChange={uploadHandler}
            />
            <TextField
              className={styles.input}
              id='username'
              label='Username'
              variant='outlined'
              helperText={usernameHelper}
              onChange={(e) => usernameHandler(e)}
              error={usernameErr}
              value={newUsername}
            />
            <CustomButton
              onClick={() => editHandler(newUsername, newImage)}
              isPurple
              title='Edit'
              small
            />
            {!isValid && <p className={styles.error}>Invalid entries.</p>}
            {isLoading && <CircularProgress />}
          </form>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default EditProfile;
