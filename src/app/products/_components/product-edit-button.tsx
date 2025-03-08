'use client'

import DeleteProduct from '@/app/products/_components/delete-product'
import { Button } from '@/components/ui/button'
import { isClient } from '@/lib/http'
import { ProductResType } from '@/schemaValidations/product.schema'
import Link from 'next/link'
import React from 'react'

const ProductEditButton = ({
  product
}: {
  product: ProductResType['data']
}) => {
  const isAuthenticated =
    isClient() && Boolean(localStorage.getItem('sessionToken'))

  if (!isAuthenticated) return null

  return (
    <div className='flex items-start space-x-2'>
      <Link href={`/products/${product.id}/edit`}>
        <Button variant='outline'>Edit</Button>
      </Link>
      <DeleteProduct product={product} />
    </div>
  )
}

export default ProductEditButton
