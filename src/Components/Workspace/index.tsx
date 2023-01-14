import { WorkspaceProps } from "../../types";
import './Workspace.css';

const Workspace = ({ shift, input, output }: WorkspaceProps) => {
  return (
    <div className="workspace-container">
      <div className="console">
        <span className="">Input</span>
        <span className="">{shift ? <div>SHIFT ON</div> : <></>}</span>
        <div className="">{input.join('')}</div>
      </div>
      <div className="console">
        <span className="">Output</span>
        <div className="">{output}</div>
      </div>
    </div>
  );
}

export default Workspace;
