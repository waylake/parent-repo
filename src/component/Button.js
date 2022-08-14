import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Button.css";

const mode = {
  edit: 'Edit',
  save: 'Save',
  parallel: 'Change branch to parallel',
  cross: 'Change branch to cross',
}

function Button(props) {
  const tooltipText = mode[props.mode];
  const classNames = `button ${props.mode}`
  return (
    <button className={classNames} type="button" data-tooltip={tooltipText} onClick={e => {
      e.preventDefault();
      props.onChangeMode();
    }}><FontAwesomeIcon icon={props.icon} />
    </button>
  )

}

export default Button;