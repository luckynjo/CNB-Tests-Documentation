import {Paragraph} from '../components/Paragraph.js';
import {Image} from '../components/Image.js';
import {Span} from '../components/Span.js';

export const SimpleInstructionsParser = ({components}) => {
  //components.map
  // https://codeburst.io/a-complete-guide-to-props-children-in-react-c315fab74e7c

  // Prefer to use router or some other fancy component here.
  return(
    <>
    {
      components.map((component, index) => {
        console.log(component);
        if(component.type === 'Span'){
          return <Span key={index} {...component} />
        } else if(component.type === 'Image'){
          return <Image key={index} {...component} />
        } else {
          return <Paragraph key={index} {...component} />
        }
      })
    }
    </>
  )
}
