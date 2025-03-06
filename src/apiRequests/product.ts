import http from '@/lib/http'

import {
  CreateProductBodyType,
  ProductListResType,
  ProductResType
} from '@/schemaValidations/product.schema'

const productApiRequest = {
  getList: () => http.get<ProductListResType>('/products'),
  getDetail: (id: number) => http.get<ProductResType>(`/products/${id}`),
  create: (body: CreateProductBodyType) =>
    http.post<ProductResType>('/products', body),
  uploadImage: (body: FormData) =>
    http.post<{ data: string; message: string }>('/media/upload', body)
}

export default productApiRequest
