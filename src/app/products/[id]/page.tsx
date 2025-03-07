import productApiRequest from '@/apiRequests/product'
import Image from 'next/image'
import React from 'react'

const ProductDetail = async ({ params }: { params: { id: string } }) => {
  let product = null

  try {
    const { payload } = await productApiRequest.getDetail(Number(params.id))
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
