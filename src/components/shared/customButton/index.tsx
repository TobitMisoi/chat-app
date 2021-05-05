import { FC } from "react";
import styles from "./styles.module.scss";

type Props = {
    isPurple: boolean,
    onClick: () => void,
    title: string,
    type?: 'button' | 'submit' | 'reset' | undefined,
    small: boolean
};

const CustomButton: FC<Props> = props => {
    if (!props.isPurple) {
        return (
            <button
                onClick={props.onClick}
                className={styles.black}
                type={props.type ? props.type : 'submit'}
            >
                {props.title}
            </button>
        )
    } else {
        return (
            <button
                onClick={props.onClick}
                className={props.small ? styles.smallPurple : styles.purple}
            >

                {props.title}
            </button>
        )
    }
}

export default CustomButton;