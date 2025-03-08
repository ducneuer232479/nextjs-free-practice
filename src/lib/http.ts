import envConfig from '@/config'
import { normalizePath } from '@/lib/utils'
import { LoginResType } from '@/schemaValidations/auth.schema'
import { redirect } from 'next/navigation'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

export const ENTITY_ERROR_STATUS = 422
export const AUTHENTICATION_ERROR_STATUS = 401

export type EntityErrorPayload = {
  message: number
  errors: {
    message: string
    field: string
  }[]
}

export class HttpError extends Error {
  payload: any
  status: number
  constructor({ payload, status }: { payload: any; status: number }) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: 422
  payload: EntityErrorPayload
  constructor({
    status,
    payload
  }: {
    status: 422
    payload: EntityErrorPayload
  }) {
    super({ status, payload })
    this.status = status
    this.payload = payload
  }
}

export const isClient = () => typeof window !== 'undefined'

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions
) => {
  let body: FormData | string | undefined = undefined

  if (options?.body instanceof FormData) {
    body = options.body
  } else if (options?.body) {
    body = JSON.stringify(options?.body)
  }

  const baseHeaders: { [key: string]: string } =
    body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json'
        }

  if (isClient()) {
    const sessionToken = localStorage.getItem('sessionToken')

    if (sessionToken) {
      baseHeaders.Authorization = `Bearer ${sessionToken}`
    }
  }

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl

  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    } as any,
    body,
    method
  })

  const payload: Response = await res.json()

  const data = {
    status: res.status,
    payload
  }

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422
          payload: EntityErrorPayload
        }
      )
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient()) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders
            } as any
          })
        } catch (error) {
        } finally {
          localStorage.removeItem('sessionToken')
          localStorage.removeItem('sessionTokenExpiresAt')
          location.href = '/login'
        }
      } else {
        const sessionToken = (options?.headers as any).Authorization.split(
          'Bearer '
        )[1]
        redirect(`/logout?sessionToken=${sessionToken}`)
      }
    } else {
      throw new HttpError(data)
    }
  }

  if (isClient()) {
    if (
      ['auth/login', 'auth/register'].some(
        (item) => item === normalizePath(url)
      )
    ) {
      const { token, expiresAt } = (payload as LoginResType).data
      localStorage.setItem('sessionToken', token)
      localStorage.setItem('sessionTokenExpiresAt', expiresAt)
    } else if ('auth/logout' === normalizePath(url)) {
      localStorage.removeItem('sessionToken')
      localStorage.removeItem('sessionTokenExpiresAt')
    }
  }

  return data
}

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('GET', url, options)
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('DELETE', url, { ...options })
  }
}

export default http
