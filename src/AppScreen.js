// @flow
import React, { type ChildrenArray, type Element } from 'react'

export default ({
  children,
  className = '',
}: {
  children: ChildrenArray<Element<any> | null>,
  className: string,
}) => <div className={`App-body ${className}`}>{children}</div>
