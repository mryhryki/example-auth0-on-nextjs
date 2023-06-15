import {useCallback, useRef, useState} from "react";

interface TestResult {
  id: string
  time: string
  status: string
  body: string
}

interface UseFetchTestState {
  fetchTest: () => Promise<void>
  testResults: TestResult[]
  lastRequestUnixTime: number
}

export const useFetchTest = (): UseFetchTestState => {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const lastRequestUnixTime = useRef<number>(new Date().getTime())

  const fetchTest = useCallback(async (): Promise<void> => {
    const id = crypto.randomUUID()
    const now = new Date();
    lastRequestUnixTime.current = now.getTime()
    const time = now.toISOString()
    const response = await fetch("/api/info")
    const body = await response.text();
    setTestResults((current) => [...current, {id, status: `${response.status} ${response.statusText}`, body, time}])
  }, [setTestResults])

  return {
    fetchTest,
    lastRequestUnixTime: lastRequestUnixTime.current,
    testResults
  }
}
