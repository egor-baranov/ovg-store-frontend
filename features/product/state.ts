import { combine, createEffect, createEvent, createStore, forward, sample } from "effector"
import { Controller } from "fry-fx"
import { PageContext } from "nextjs-effector"
import {ProductResponse} from "../../models/response/ProductResponse";
import {getProductById} from "../../api";
import { isNotNull } from "../../functions/utils"

export const $productId = createStore<string | null>(null)

export const productPageLoaded = createEvent<PageContext>()

const productIdChanged = createEvent<string | null>()

sample({
    source: productPageLoaded,
    fn: (ctx) => ctx.params.id as string,
    target: productIdChanged,
})

sample({
    source: productIdChanged,
    target: $productId,
})

const productIdChangedNotNull = productIdChanged.filter({ fn: isNotNull })

const $product = createStore<ProductResponse | null>(null)

const loadProductFx = createEffect<string, ProductResponse | null, Error>({
    name: "loadProductFx",
    sid: "loadProductFx",
    handler: async (productId, controller?: Controller) => {
        return getProductById(productId, controller?.getSignal())
    },
})

sample({
    source: productIdChangedNotNull,
    target: loadProductFx,
})

forward({
    from: loadProductFx.doneData,
    to: $product,
})

const $productState = combine({
    isLoading: loadProductFx.pending,
    product: $product,
})

export { $product, $productState }