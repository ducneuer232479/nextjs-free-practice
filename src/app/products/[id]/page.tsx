import productApiRequest from '@/apiRequests/product'
import Image from 'next/image'
import React, { cache } from 'react'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const getDetail = cache(productApiRequest.getDetail)

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { payload } = await getDetail(Number(params.id))
  const product = payload.data

  return {
    title: product.name,
    description: product.description
  }
}

const ProductDetail = async ({ params }: { params: { id: string } }) => {
  let product = null

  try {
    const { payload } = await getDetail(Number(params.id))
    product = payload.data
  } catch (error) {}

  return product ? (
    <div>
      <Image
        src={product.image}
        alt=''
        width={180}
        height={180}
        className='w-32 h-32 object-cover'
      />

      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  ) : (
    <div>Không tìm thấy sản phẩm</div>
  )
}

export default ProductDetail
