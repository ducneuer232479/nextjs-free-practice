import http from '@/lib/http'
import { AccountResType } from '@/schemaValidations/account.schema'

export const accountApiRequest = {
  me: (sessionToken: string) =>
    http.get<AccountResType>('/account/me', {
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    }),
  meClient: () => http.get<AccountResType>('/account/me')
}
