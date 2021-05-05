import axios from "axios";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CustomButton from "../../shared/customButton";
import styles from './styles.module.scss';

type Props = {};



const Welcome: FC<Props> = props => {
    const dispatch = useDispatch()

    // Async request
    const guestRequest = async () => {
        let res;
        try {
            res = await axios.post(``);

        } catch (err) {
            console.log('[ERROR][AUTH][GUEST]:' + err);
            return;
        }
        dispatch({ type: 'GUEST', payload: { ...res.data.user } })
    }

    return (
        <>
            <div>
                <img className={styles.container} src="https://raw.githubusercontent.com/KillianFrappartDev/GroupChat/master/frontend/src/assets/gc-logo.png" alt="logo" />
                <Link to="/login">
                    <CustomButton onClick={() => { }} small={false} title="Login" isPurple={false} />
                </Link>
                <Link to="/signup">
                    <CustomButton onClick={() => { }} isPurple={true} title="Signup" small={false} />
                </Link>
                <p className={styles.guest} onClick={guestRequest}>
                    Continue as guest
                </p>
            </div>
        </>
    )
}

export default Welcome;