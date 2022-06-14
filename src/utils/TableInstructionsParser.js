import {Paragraph} from '../components/Paragraph.js';
import {Image} from '../components/Image.js';
import {Span} from '../components/Span.js';

/***
Takes as input instructions text which also contain a 2d array of JSON objects and renders it as an HTML.
The 2d array is rendered as an HTML table while the rest of the task is rendered accoridng to the type of instructions it is.
The table must be given in the following form:
[[c1,c2,c3,c4.....],[c1,c2,c3,....], [[c1,c2,c3,....]]]
*/
export const TableInstructionsParser = ({components}) => {

  const parseRow = row_info => {
    const row = row_info;
    console.log('row info is ', row);
    return (
      <tr>
      {row.map((col, index) => {
        if(col.type == 'Span')
        {
          return <td key={index}><Span {...col} /></td>
        }
        else if(col.type == 'Image')
        {
          return <td key={index}><Image {...col} /></td>
        }
        else
        {
          return <td key={index}><Paragraph {...col} /></td>
        }
      })}
      </tr>
    )
  }
  // Takes as input [[c1,c2,c3,c4.....],[c1,c2,c3,....], [[c1,c2,c3,....]]]
  const asTable = table_rows => {
    console.log('rows are ', table_rows);
    return (
      <table>
      <tbody>
      {table_rows.map((row, index) => {
        return parseRow(row, index);
      })}
      </tbody>
      </table>
    )
  }
  //components.map
  // https://codeburst.io/a-complete-guide-to-props-children-in-react-c315fab74e7c

  // Prefer to use router or some other fancy component here.
  return(
    <>
    {
      components.map((component, index) => {
        console.log(component);
        if(component.type === 'Span')
        {
          return <Span key={index} {...component} />
        }
        else if(component.type === 'Image')
        {
          return <Image key={index} {...component} />
        }
        else if(component.type === 'Paragraph')
        {
          return <Paragraph key={index} {...component} />
        }
        else
        {
          return <>{asTable(component.rows)}</>
        }
      })
    }
    </>
  )
}
