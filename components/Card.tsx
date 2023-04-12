import {Favorite, FavoriteBorder, Remove, Search, ShoppingBagOutlined, ShoppingCart} from "@mui/icons-material"
import React, {useState} from "react"
import colors from "tailwindcss/colors"
import {useRouter} from "next/router";

export const Card: React.FC<{ id: string, label: string, price: string, imageUrl: string, selectedByDefault: boolean, onUpdate: Function }> =
    ({id, label, price, imageUrl, selectedByDefault, onUpdate}) => {

        const [color, setColor] = useState<string>(colors.gray[100])
        const [favorite, setFavorite] = useState<boolean>(selectedByDefault)

        const router = useRouter()

        function onMouseEnter() {
            setColor('black')
        }

        function onMouseLeave() {
            setColor(colors.gray[100])
        }

        function openProduct() {
            router.push("/product/" + id)
        }

        function addToFavorite() {
            setFavorite(!favorite)

            if (typeof window == 'undefined') {
                return
            }

            const favoriteCount: number = Number(window.localStorage.getItem("favorite-count"))
            const newCount = !favorite ? favoriteCount + 1 : favoriteCount - 1

            window.localStorage.setItem("favorite-count", String(newCount))
            onUpdate(newCount)
        }

        return (
            <div
                className="relative max-w-sm bg-gray-100 border border-gray-100 rounded-lg dark:border-gray-100 px-2 py-2"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <a href="#">
                    <img className="rounded-t-lg" src="https://storage.yandexcloud.net/ovg-store/img-2.png" width='300px' height='300px'
                           onMouseDown={openProduct}/>
                </a>
                <div className="px-4" onMouseDown={openProduct}>
                    <p className="mb-3 text-bold text-gray-900 dark:text-gray-900 text-center">
                        {label}
                    </p>
                    <a href="#">
                        <h5 className=" mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                            {price} р.
                        </h5>
                    </a>
                </div>

                <a className="absolute top-2 right-2 leading-none text-black flex-shrink-0">
                    {favorite ?
                        <Favorite fontSize="medium" onClick={addToFavorite}/> :
                        <FavoriteBorder fontSize="medium" sx={{color: {color}}} onClick={addToFavorite}/>}
                </a>
            </div>
        )
    }