import {useEffect, useState} from "react";

export const useElapsedSec = (baseUnixTime: number): number => {
  const [elapsedSec, setElapsedSec] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      const time = new Date().getTime()
      setElapsedSec(time - baseUnixTime)
    }, 100)
    return () => clearInterval(timer)
  }, [baseUnixTime, setElapsedSec])
  return Math.floor(elapsedSec/1000);
}
