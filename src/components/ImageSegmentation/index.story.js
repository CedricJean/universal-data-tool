// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ImageSegmentation from "./"

storiesOf("ImageSegmentation", module).add("All Labels Enabled", () => (
  <ImageSegmentation
    onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
    interface={{
      type: "image_segmentation",
      description: "Some task description",
      availableLabels: ["human", "dog", "cat"]
    }}
    taskData={[
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg"
      },
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg"
      },
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image3.jpg"
      }
    ]}
    taskOutput={[
      {
        regionType: "bounding-box",
        centerX: 0.5,
        centerY: 0.5,
        width: 0.25,
        height: 0.25,
        color: "#f00"
      },
      null,
      null
    ]}
  />
))
