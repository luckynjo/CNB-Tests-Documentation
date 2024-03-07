// Manages the CSS depending on the language
export function StyleManager(lang, classnames){
  let result_classnames = "";
  for(let i=0; i<classnames.length; i++){
    if(i === classnames.length-1){
      result_classnames = result_classnames + " " + lang + "-" + classnames[i];
    } else {
      result_classnames = result_classnames + " " + lang + "-" + classnames[i] + " ";
    }
  }
  return result_classnames;
}
