import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Button.css";

const modeList = {
  edit: 'Edit',
  save: 'Save',
  parallel: 'Change branch to parallel',
  cross: 'Change branch to cross',
}

function Button({ mode, icon, onChangeMode, onChangeBranch }) {
  const tooltipText = modeList[mode];
  const classNames = `button ${mode}`

  const handleMode = onChangeMode ? () => onChangeMode() : undefined;
  const handleBranch = onChangeBranch ? () => onChangeBranch(mode) : undefined;
  const onClick = () => {

    if (handleMode) handleMode();
    if (handleBranch) handleBranch(mode);

  }
  return (
    <button className={classNames} type="button" data-tooltip={tooltipText} onClick={(e) => {
      e.preventDefault();
      onClick();
    }}><FontAwesomeIcon icon={icon} />
    </button>
  )

}

export default Button;