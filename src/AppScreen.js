// @flow
import React, { type Node } from 'react'

export default ({
  children,
  className = '',
}: {
  children: Node,
  className?: string,
}) => <div className={`App-body ${className}`}>{children}</div>
