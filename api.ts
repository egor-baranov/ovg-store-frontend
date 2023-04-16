import {ProductResponse} from "./models/response/ProductResponse";
import {CategoriesResponse} from "./models/response/CategoriesResponse";


const apiRoot = process.env.BACKEND_URL!!

export function getProductById(id: string, signal?: AbortSignal): Promise<ProductResponse | null> {
    return fetch(`${apiRoot}/products/${id}`, { signal })
        .then(async (res) => {
            if (res.status === 404) {
                return null
            }
            if (res.status > 400) {
                throw new Error() // todo
            }
            return await res.json() as ProductResponse
        })
}

export function searchProducts(query: string, signal?: AbortSignal): Promise<ProductResponse[]> {
    const queryString = new URLSearchParams({
        query,
    })
    return fetch(`${apiRoot}/products/search?${queryString}`, { signal })
        .then(async (res) => {
            if (res.status > 400) {
                throw new Error() // todo
            }
            return await res.json() as ProductResponse[]
        })
}

export function getCategories(parentId: number | null, signal?: AbortSignal): Promise<CategoriesResponse> {
    const params = parentId !== null
        ? new URLSearchParams({ parentId: parentId.toString() })
        : new URLSearchParams()
    return fetch(`${apiRoot}/categories?${params}`, { signal })
        .then(async (res) => {
            if (res.status > 400) {
                throw new Error() // todo
            }
            return await res.json() as CategoriesResponse
        })
}

export enum SortType {
    name = "name",
    price = "price",
    unitPrice = "unitPrice",
}

export enum SortOrder {
    asc = "asc",
    desc = "desc",
}

export function getProductsByCategory(categoryId: number, {
    sortType,
    sortOrder,
    limit,
    signal,
}: {
    sortType?: SortType
    sortOrder?: SortOrder
    limit?: number
    signal?: AbortSignal
} = {}): Promise<ProductResponse[]> {
    const params = new URLSearchParams()
    if (sortType) params.append("sort", sortType)
    if (sortOrder) params.append("sortOrder", sortOrder)
    if (limit) params.append("limit", limit.toString())
    return fetch(`${apiRoot}/categories/${categoryId}/products?${params}`, { signal })
        .then(async (res) => {
            if (res.status > 400) {
                throw new Error() // todo
            }
            return await res.json() as ProductResponse[]
        })
}