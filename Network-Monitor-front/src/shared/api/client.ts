import axios, { isAxiosError } from 'axios'
import { env } from '../../config/env'
import { ApiError } from './ApiError'

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 0
      const message =
        (error.response?.data as Record<string, string>)?.message ?? error.message
      const code = (error.response?.data as Record<string, string>)?.code
      throw new ApiError(status, message, code)
    }
    throw error
  },
)
