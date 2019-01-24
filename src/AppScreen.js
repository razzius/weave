// @flow
import React, { type ChildrenArray, type Element } from 'react'

export default ({
  children,
}: {
  children: ChildrenArray<Element<any> | null>,
}) => <div className="App-body">{children}</div>
