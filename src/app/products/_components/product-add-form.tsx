'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { useToast } from '@/components/ui/use-toast'
import { authApiRequest } from '@/apiRequests/auth'

import { handleErrorApi } from '@/lib/utils'
import {
  CreateProductBody,
  CreateProductBodyType,
  ProductResType,
  UpdateProductBodyType
} from '@/schemaValidations/product.schema'
import Image from 'next/image'
import { useRef, useState } from 'react'
import productApiRequest from '@/apiRequests/product'
import { useRouter } from 'next/navigation'

type Product = ProductResType['data']

const ProductAddForm = ({ product }: { product?: Product }) => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody),
    defaultValues: {
      name: product?.name ?? '',
      price: product?.price ?? 0,
      description: product?.description ?? '',
      image: product?.image ?? ''
    }
  })

  const image = form.watch('image')

  const createProduct = async (values: CreateProductBodyType) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file as Blob)
      const uploadImageResult = await productApiRequest.uploadImage(formData)
      const imageUrl = uploadImageResult.payload.data

      const result = await productApiRequest.create({
        ...values,
        image: imageUrl
      })

      toast({
        description: result?.payload.message
      })

      router.push('/products')
      router.refresh()
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (_values: UpdateProductBodyType) => {
    if (!product) return
    setLoading(true)
    let values = _values
    try {
      if (file) {
        const formData = new FormData()
        formData.append('file', file as Blob)
        const uploadImageResult = await productApiRequest.uploadImage(formData)
        const imageUrl = uploadImageResult.payload.data

        values = {
          ...values,
          image: imageUrl
        }
      }

      const result = await productApiRequest.update(product.id, values)

      toast({
        description: result?.payload.message
      })

      router.refresh()
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    } finally {
      setLoading(false)
    }
  }

  // 2. Define a submit handler.
  const onSubmit = async (values: CreateProductBodyType) => {
    if (loading) return

    if (product) {
      await updateProduct(values)
    } else {
      await createProduct(values)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-2 max-w-[600px] w-full flex-shrink-0'
        noValidate
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder='Tên' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá</FormLabel>
              <FormControl>
                <Input placeholder='Giá' type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Input placeholder='Mô tả' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  ref={inputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setFile(file)
                      field.onChange('http://localhost:3000/' + file.name)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(file || image) && (
          <div>
            <Image
              src={file ? URL.createObjectURL(file) : image}
              alt='preview'
              width={120}
              height={120}
              style={{
                objectFit: 'cover'
              }}
            />
            <Button
              variant='destructive'
              size='sm'
              type='button'
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = ''
                }
                setFile(null)
                form.setValue('image', '')
              }}
            >
              Xoá hình ảnh
            </Button>
          </div>
        )}
        <Button type='submit' className='!mt-8 w-full'>
          {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
        </Button>
      </form>
    </Form>
  )
}

export default ProductAddForm
