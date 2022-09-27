import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Button.css";

const modeList = {
  edit: 'Edit',
  save: 'Save',
  parallel: 'Change branch to parallel',
  cross: 'Change branch to cross',
}

function Button({ mode, icon, onChangeMode, onChangeBranch, onSubmit }) {
  const tooltipText = modeList[mode];
  const classNames = `button ${mode}`

  const handleMode = onChangeMode ? () => onChangeMode() : undefined;
  const handleClick = onSubmit ? () => onSubmit() : undefined;
  const handleBranch = onChangeBranch ? () => onChangeBranch(mode) : undefined;
  return (
    <button className={classNames} type="button" data-tooltip={tooltipText} onClick={(e) => {
      e.preventDefault();
      handleMode();
      handleClick();
      handleBranch(mode);
    }}><FontAwesomeIcon icon={icon} />
    </button>
  )

}

export default Button;