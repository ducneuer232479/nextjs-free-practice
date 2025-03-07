import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import productApiRequest from '@/apiRequests/product'
import DeleteProduct from '@/app/products/_components/delete-product'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Danh sách sản phẩm',
  description: 'Danhh sách sản phẩm của Productic được tạo bởi Đức Dev'
}

const ProductListPage = async () => {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')
  const isAuthenticated = Boolean(sessionToken)

  const { payload } = await productApiRequest.getList()
  const productList = payload.data

  return (
    <div>
      <h1>Product List</h1>
      {isAuthenticated && (
        <Link href='/products/add'>
          <Button variant='secondary'>Thêm sản phẩm</Button>
        </Link>
      )}
      <div className='space-y-5'>
        {productList.map((product) => {
          return (
            <div key={product.id} className='flex space-x-4'>
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.image}
                  alt=''
                  width={180}
                  height={180}
                  className='w-32 h-32 object-cover'
                />
              </Link>

              <h3>{product.name}</h3>
              <p>{product.price}</p>
              {isAuthenticated && (
                <div className='flex items-start space-x-2'>
                  <Link href={`/products/${product.id}/edit`}>
                    <Button variant='outline'>Edit</Button>
                  </Link>
                  <DeleteProduct product={product} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductListPage
