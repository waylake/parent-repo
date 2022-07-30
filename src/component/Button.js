import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Button.module.css";


function Button(props) {
  return <button className={styles.button} type="button" onClick={e => {
    e.preventDefault();
    props.onChangeMode();
  }}><FontAwesomeIcon icon={props.icon} /></button>

}

export default Button;