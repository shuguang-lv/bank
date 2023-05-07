import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const EMAIL_REGX = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i
const NAME_REGX = /^[a-z0-9_.-]{1,127}$/
const PWD_REGX = /^[a-z0-9_.-]{1,127}$/
const NUMBER_REGX = /^[1-9]\d*(\.\d{2})?$/

export const validateEmail = (email: string) => EMAIL_REGX.test(email.trim())
export const validateName = (username: string) => NAME_REGX.test(username)
export const validatePassword = (password: string) => PWD_REGX.test(password)
export const validateBalance = (balance: number) =>
  NUMBER_REGX.test(balance + "") && balance <= 4294967295.99
