import { PRODUCTS_URL,UPLOADS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints ({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({keyword,pageNumber,category,publicCompany,minPrice,maxPrice,form,language,rate}) =>({
                url: PRODUCTS_URL,
                params: {
                    keyword,
                    category,
                    pageNumber,
                    publicCompany,
                    minPrice,
                    maxPrice,
                    form,
                    language,
                    rate
                }
            }),
            keepUnusedDataFor:5,
            providesTags: ['Products']
        }),
       getProductDetail: builder.query({
        query: (productId) =>({
            url: `${PRODUCTS_URL}/${productId}`
        }),
        keepUnusedDataFor:5
       }),
       createProduct: builder.mutation({
        query: () => ({
          url: PRODUCTS_URL,
          method: 'POST',
        }),
        invalidatesTags: ['Product'],
      }),
      updateProduct: builder.mutation({
        query: (data) => ({
          url: `${PRODUCTS_URL}/${data.productId}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['Products'], 
      }),
      uploadProductImage: builder.mutation({
        query: (data) => ({
          url: `${UPLOADS_URL}`,
          method: 'POST',
          body: data,
        }),
      }),
      deleteProduct: builder.mutation({
        query: (productId) => ({
          url: `${PRODUCTS_URL}/${productId}`,
          method: 'DELETE',
        }),
        providesTags: ['Product'],
      }),
      createReview: builder.mutation({
        query: (data) => ({
          url: `${PRODUCTS_URL}/${data.productId}/reviews`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Product'],
      }),
      getTopProducts: builder.query({
        query: () => `${PRODUCTS_URL}/top`,
        keepUnusedDataFor: 5,
      }),
      getProducts1:builder.query({
        query: () =>({
          url: `${PRODUCTS_URL}/getProducts1`,
      }),
      keepUnusedDataFor:5
      })
    })
});
export const {useGetProductsQuery, useGetProductDetailQuery,useCreateProductMutation, useUpdateProductMutation,useUploadProductImageMutation, useDeleteProductMutation, useCreateReviewMutation,useGetTopProductsQuery ,useGetProducts1Query} = productsApiSlice;

