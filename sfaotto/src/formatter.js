import { isNaN } from 'lodash'
import currencyFormatter from 'currency-formatter'

const formattingOptions = {
  thousand: '.',
  precision: 0,
  decimal: ',',
}

export function formatNumber(inputValue) {
  return currencyFormatter.format(inputValue, formattingOptions)
}

export function unformatNumber(inputValue) {
  return currencyFormatter.unformat(inputValue, formattingOptions)
}

export function formatRupiah(amount) {
  return `Rp ${currencyFormatter.format(amount, formattingOptions)}`
}

export const stringLocaleCurrency = (num = 0) => {
  const newNum = new Intl.NumberFormat(['id', 'en'], {
    style: 'currency',
    currency: 'IDR',
  })
    .format(num)
    .replace(/Rp/, 'Rp ')
    .replace(/,00/, '')
  return newNum
}

export const stringLocaleDate = (date = 0) => {
  date = parseInt(date, 10)
  if (isNaN(date)) {return null}
  const newDate = new Intl.DateTimeFormat(['id', 'en'], {
    // weekday: "long",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'Asia/Jakarta',
  }).format(new Date(date))
  return newDate
}

// export const formatRupiah = (value) => {
//   if (!value) { return `Rp 0`}
//   return `Rp ${(parseInt(value, 10).toLocaleString('de-DE', 'minimumFractionDigits': 2))}`
// }

// export const formatNumber = (value) => {
//   if (!value) { return 0}
//   return (parseInt(value, 10).toLocaleString('de-DE', 'minimumFractionDigits': 2))
// }
