import { useContext, useMemo, useState, useEffect } from "react"

import useIsLabelOnlyMode from "../../utils/use-is-label-only-mode"
import { useActiveDataset } from "../FileContext"
import { useAppConfig } from "../AppConfig"
import { LabelHelpContext } from "./LabelHelpProvider.js"
import { setIn } from "seamless-immutable"
import computeDatasetVariable from "../../utils/compute-dataset-variable"

export const useLabelHelp = () => {
  const isLabelOnlyMode = useIsLabelOnlyMode()
  const { dataset, setDataset } = useActiveDataset()
  const {
    pricingConfig,
    myCredits,
    remoteFile,
    loadPricingConfig,
    loadMyCredits,
  } = useContext(LabelHelpContext)
  const { fromConfig } = useAppConfig()
  const labelHelpDisabled = Boolean(fromConfig("labelhelp.disabled"))
  const hasLabelHelpAPIKey = Boolean(fromConfig("labelhelp.apikey"))

  useEffect(() => {
    if (labelHelpDisabled || isLabelOnlyMode) return
    if (!pricingConfig) loadPricingConfig()
  }, [pricingConfig, isLabelOnlyMode, labelHelpDisabled])

  if (labelHelpDisabled)
    return { labelHelpEnabled: false, labelHelpError: "Disabled in config" }
  if (isLabelOnlyMode) return { labelHelpEnabled: false }
  if (!hasLabelHelpAPIKey && dataset.samples.length < 100) {
    return {
      labelHelpEnabled: false,
      labelHelpError: "Less than 100 samples",
    }
  }
  if (!pricingConfig) {
    return {
      labelHelpEnabled: false,
      labelHelpError: "No pricing config",
    }
  }

  try {
    const { formula, variables: variableDescriptions } =
      pricingConfig[dataset.interface.type] || {}

    if (!formula)
      return {
        labelHelpEnabled: false,
        labelHelpError: `No pricing formula for "${dataset.interface.type}"`,
      }

    const variables = {}
    for (const variableName of Object.keys(variableDescriptions)) {
      variables[variableName] = computeDatasetVariable(dataset, variableName)
    }

    const funcArgs = Object.keys(variables)
    // TODO sanitize formula
    // eslint-disable-next-line
    const formulaFuncPos = new Function(...funcArgs, "return " + formula)
    const formulaFunc = (variables) => {
      return formulaFuncPos(...funcArgs.map((ak) => variables[ak]))
    }
    const totalCost = formulaFunc(variables)

    return {
      labelHelpEnabled: true,
      myCredits,
      loadMyCredits,
      remoteFile,
      formula,
      variableDescriptions,
      variables,
      formulaFunc,
      totalCost,
      labelHelpAPIKey: fromConfig("labelhelp.apikey"),
    }
  } catch (e) {
    return { labelHelpEnabled: false, labelHelpError: e.toString() }
  }
}
