export interface DataChart {
  price: number,
  volume: number,
}

export interface FetchData {
  timestamp: Date,
  bids: DataChart[],
  asks: DataChart[]
}
