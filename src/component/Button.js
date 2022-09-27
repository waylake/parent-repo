import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Button.css";

const modeList = {
  edit: 'Edit',
  save: 'Save',
  parallel: 'Change branch to parallel',
  cross: 'Change branch to cross',
}

function Button({ mode, onChangeMode, icon, onSubmit }) {
  const tooltipText = modeList[mode];
  const classNames = `button ${mode}`
  const handleClick = onSubmit ? () => onSubmit() : undefined;
  return (
    <button className={classNames} type="button" data-tooltip={tooltipText} onClick={e => {
      e.preventDefault();
      onChangeMode();
      handleClick();
    }}><FontAwesomeIcon icon={icon} />
    </button>
  )

}

export default Button;