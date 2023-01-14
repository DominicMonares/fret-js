import { WorkspaceProps } from "../../types";
import './Workspace.css';

const Workspace = ({ shift, input, output }: WorkspaceProps) => {
  return (
    <div className="workspace-container">
      <div className="console">
        <span className="label">Input</span>
        <span className="shift">{shift ? <div>SHIFT ON</div> : <></>}</span>
        <div className="content">{input.join('')}</div>
      </div>
      <div className="console">
        <span className="label">Output</span>
        <div className="content">{output}</div>
      </div>
    </div>
  );
}

export default Workspace;
