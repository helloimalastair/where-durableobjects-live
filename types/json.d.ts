interface ColoJSONV1 {
  [key: string]: {
    [key: string]: number
  }
}

interface ColoJSONV2 {
  [key: string]: {
    [key: string]: {
      likehlihood: number,
      latency: number
    }
  }
}