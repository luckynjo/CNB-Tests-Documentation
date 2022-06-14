import React from 'react';

// A row is a layout that renders its children in a row.
export const Row = ({children, classList}) => {
  return (
    <>
    <div className={"row " + classList}>
    {children}
    </div>
    </>
  )
}
