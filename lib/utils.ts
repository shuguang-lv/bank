import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const EMAIL_REGX = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i
const NAME_REGX = /^[_\\-\\.0-9a-z]{1,127}$/
const PWD_REGX = /^[_\\-\\.0-9a-z]{1,127}$/
const NUMBER_REGX = /^[1-9]\d*(\.\d{2})?$/

export const validateEmail = (email: string) => EMAIL_REGX.test(email.trim())
export const validateName = (username: string) => NAME_REGX.test(username)
export const validatePassword = (password: string) => PWD_REGX.test(password)
export const validateBalance = (balance: number) =>
  balance > 0 && balance <= 4294967295.99 && NUMBER_REGX.test(balance + "")

export type StatusCode = 200 | 201 | 401 | 403 | 400 | 422 | 500

export const handleErrorMsg = (statusCode: StatusCode) => {
  switch (statusCode) {
    case 401:
      return "No credential provided"
    case 403:
      return "Invalid credential"
    case 400:
      return "Wrong request method / Lack of mandatory parameters"
    case 422:
      return "Invalid amount of currency"
    default:
      return "Unknown Server Error"
  }
}
