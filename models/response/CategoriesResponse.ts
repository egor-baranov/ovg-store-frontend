import {ProductResponse} from "./ProductResponse";

export type CategoriesResponse = {
    categories: Map<string, ProductResponse[]>
}
