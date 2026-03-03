import { Source } from "./lib/domain/DataFecther"

export const dev = false

export const source: Source = dev ? Source.yfinance : Source.binance
