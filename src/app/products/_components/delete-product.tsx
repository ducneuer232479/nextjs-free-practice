'use client'

import React from 'react'
import { ProductResType } from '@/schemaValidations/product.schema'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import productApiRequest from '@/apiRequests/product'
import { useRouter } from 'next/navigation'
import { handleErrorApi } from '@/lib/utils'

const DeleteProduct = ({ product }: { product: ProductResType['data'] }) => {
  const { toast } = useToast()
  const router = useRouter()

  const deleteProduct = async () => {
    try {
      const result = await productApiRequest.delete(product.id)

      toast({
        description: result.payload.message
      })

      router.refresh()
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='destructive'>Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có muốn xoá sản phẩm không?</AlertDialogTitle>
            <AlertDialogDescription>
              Sản phẩm &quot;{product.name}&quot; sẽ bị xoá vĩnh viễn
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DeleteProduct
