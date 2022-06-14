import {TableInstructionsParser} from '../utils/TableInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const TableInstructions = props => {
  const {instructions, onGoBack, onContinue} = props;
  return (
    <>
    <div className = "instructions">
      <TableInstructionsParser components={instructions} />
    </div>
    <div className="position-bottom--absolute">
    <table className="buttons-table">
    <tbody>
    <tr>
    <td><div>{onGoBack && <GoBackButton onClick={onGoBack}/>}</div></td>
    <td><ContinueButton onClick={onContinue}/></td>
    <td><div></div></td>
    </tr>
    </tbody>
    </table>
    </div>
    </>
  )
}
