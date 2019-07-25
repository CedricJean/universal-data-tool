// @flow

import React, { useMemo } from "react"
import ReactImageAnnotate from "react-image-annotate/Annotator"

export default ({ interface: iface, taskData, taskOutput }) => {
  const {} = useMemo(() => {
    return {}
  }, [iface, taskData])
  return (
    <div>
      <ReactImageAnnotate taskDescription={iface.description} />
    </div>
  )
}
