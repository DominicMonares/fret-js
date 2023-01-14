import { WorkspaceProps } from "../../types";
import './Workspace.css';

const Workspace = ({ shift, input, output }: WorkspaceProps) => {
  return (
    <div className="workspace">
      <div>
        <span className="input-label">Input</span>
        <span className="shift">{shift ? <div>SHIFT ON</div> : <></>}</span>
        <div className="input">{input.join('')}</div>
      </div>
      <div>
        <span className="output-label">Output</span>
        <div className="output">{output}</div>
      </div>
    </div>
  );
}

export default Workspace;
