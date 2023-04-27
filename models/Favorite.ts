import {z} from "zod"

export const FavoriteModelSchema = z.object({
    items: z.array(z.string())
})

export type FavoriteModel = z.infer<typeof FavoriteModelSchema>
