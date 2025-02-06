import DefaultLayout from '@/components/Layouts/DefaultLayout'
import ProductTable from '@/components/Tables/ProductsTable'
import React from 'react'

const ProductList = () => {
  return (
    <DefaultLayout>
    <ProductTable />
    </DefaultLayout>
  )
}

export default ProductList