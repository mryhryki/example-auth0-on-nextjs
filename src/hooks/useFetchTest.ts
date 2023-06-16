import {useCallback, useRef, useState} from "react";
import {getId} from "@/utils/id";

interface TestResultWaiting {
  type: "waiting"
  settingId: string
}

interface TestResultFinished {
  type: "finished"
  id: string
  settingId: string
  time: string
  status: string
  body: string
}

type TestResult = TestResultWaiting | TestResultFinished

interface TestSetting {
  id: string
  requestDelay: number
  apiExecuteBeforeDelay: number
  apiExecuteAfterDelay: number
}

interface UseFetchTestState {
  fetchTest: () => Promise<void>
  testResults: TestResult[]
  lastRequestUnixTime: number
  settings: TestSetting[]
  addSetting: () => void
  editSetting: (id: string, settings: Partial<TestSetting>) => void
  removeSetting: (id: string) => void
}

const getValidSetting = (setting: Partial<TestSetting>): TestSetting => {
  const id = setting.id ?? getId("S")
  return ({
    id,
    requestDelay: Math.max(0, Math.min(setting.requestDelay ?? 0, 60)),
    apiExecuteBeforeDelay: Math.max(0, Math.min(setting.apiExecuteBeforeDelay ?? 0, 60)),
    apiExecuteAfterDelay: Math.max(0, Math.min(setting.apiExecuteAfterDelay ?? 0, 60)),
  })
}

export const useFetchTest = (): UseFetchTestState => {
  const [settings, setSettings] = useState<TestSetting[]>([])
  const addSetting = useCallback((): void =>
    setSettings((currentSettings) => [...currentSettings, getValidSetting({})]), [setSettings])
  const editSetting = useCallback((id: string, setting: Partial<TestSetting>) => {
    setSettings((currentSettings) => currentSettings.map((currentSetting) =>
      currentSetting.id === id ? getValidSetting({...currentSetting, ...setting}) : currentSetting))
  }, [setSettings])
  const removeSetting = useCallback((id: string): void => {
    setSettings((currentSettings) => currentSettings.filter((currentSetting) => currentSetting.id !== id))
  }, [setSettings])

  const [testResults, setTestResults] = useState<TestResult[]>([])
  const lastRequestUnixTime = useRef<number>(new Date().getTime())
  const fetchTest = async (): Promise<void> => {
    setTestResults(settings.map((setting): TestResultWaiting => ({type: 'waiting', settingId: setting.id})))
    await Promise.all(settings.map(async (setting) => {
      if (setting.requestDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, setting.requestDelay * 1000))
      }
      const id = getId('R')
      const response = await fetch("/api/info")
      const body = await response.text();
      setTestResults((currentResults) => currentResults.map((currentResult) => {
        if (currentResult.settingId !== setting.id) {
          return currentResult
        }
        return {
          type: "finished",
          id,
          settingId: setting.id,
          status: `${response.status} ${response.statusText}`,
          body,
          time: new Date().toISOString()
        }
      }))
    }))
    lastRequestUnixTime.current = new Date().getTime()
  }

  return {
    fetchTest,
    lastRequestUnixTime: lastRequestUnixTime.current,
    testResults,
    settings,
    addSetting,
    editSetting,
    removeSetting,
  }
}
