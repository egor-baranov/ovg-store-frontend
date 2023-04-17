import type {
    GetServerSideProps,
    GetServerSidePropsResult,
    GetStaticPaths,
    InferGetServerSidePropsType,
    NextPage
} from "next"
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {MainLayout} from "../../components/Layout";
import {Favorite, FavoriteBorder, FavoriteOutlined, ShoppingBagOutlined} from "@mui/icons-material";
import {useRouter} from "next/router";
import clsx from "clsx";
import html from './index.module.css'
import {CartModel, CartModelSchema} from "../../models/Cart";
import {Model, ModelSchema} from "../../models/ProductSchema";
import {GetStaticPropsResult} from "next";
import {ProductResponse} from "../../models/response/ProductResponse";
import useSWR, { Fetcher } from 'swr';

const SizeButton: React.FC<{ text: string, onClick: Function, selected: boolean }> = ({text, onClick, selected}) => {
    return (
        <button
            onMouseDown={() => onClick()}
            type="button"
            className={selected ? "text-white bg-black hover:bg-gray-900 font-medium text-sm px-1 py-2 border border-gray-200 rounded-lg" :
                "text-black bg-white hover:bg-gray-100 font-medium text-sm px-1 py-2 border border-gray-200 rounded-lg"}>
            {text}
        </button>
    )
}

const ProductDetails: React.FC<{ product: ProductResponse | null, addToCart: any, isMobile: boolean }> = ({
                                                                                                       product,
                                                                                                       addToCart,
                                                                                                       isMobile
                                                                                                   }) => {

    const [size, setSize] = useState<string>("L")
    const [color, setColor] = useState<string>("black")
    const [favorite, setFavorite] = useState<boolean>(false)


    function updateSize(newSize: string) {
        setSize(newSize)
    }

    function updateColor(newColor: string) {
        setColor(newColor)
    }

    function buildModel(color: string, size: string) {
        return {
            product: {
                id: product?.id,
                label: product?.label,
                description: product?.description,
                price: Number(product?.price ?? 0)
            },
            color: color,
            size: size,
            amount: 1
        }
    }

    function addToFavorite() {
        setFavorite(!favorite)

        if (typeof window == 'undefined') {
            return
        }

        const favoriteCount: number = Number(window.localStorage.getItem("favorite-count"))
        const newCount = !favorite ? favoriteCount + 1 : favoriteCount - 1

        window.localStorage.setItem("favorite-count", String(newCount))
    }

    return (
        <span
            className="flex flex-auto flex-col justify-between rounded-[16px] border border-gray-200 pt-8">

                <h1 className="text-medium mb-4 pt-0 pb-2 font-medium text-center">Размер</h1>

                <div className={isMobile ? "grid gap-2 grid-cols-5 px-2" : "grid gap-2 grid-cols-4 px-2"}>
                    <SizeButton text="S" onClick={() => updateSize("S")} selected={size == "S"}></SizeButton>
                    <SizeButton text="M" onClick={() => updateSize("M")} selected={size == "M"}></SizeButton>
                    <SizeButton text="L" onClick={() => updateSize("L")} selected={size == "L"}></SizeButton>
                    <SizeButton text="XL" onClick={() => updateSize("XL")} selected={size == "XL"}></SizeButton>
                    <SizeButton text="2XL" onClick={() => updateSize("2XL")} selected={size == "2XL"}></SizeButton>
                </div>


                <h1 className="text-medium mb-4 pt-4 pb-2 font-medium text-center">Цвет</h1>

                <div className={"grid gap-2 grid-cols-2 px-2"}>
                    <SizeButton text="Белый" onClick={() => updateColor("white")}
                                selected={color == "white"}></SizeButton>
                    <SizeButton text="Серый" onClick={() => updateColor("gray")}
                                selected={color == "gray"}></SizeButton>
                    <SizeButton text="Черный" onClick={() => updateColor("black")}
                                selected={color == "black"}></SizeButton>
                    <SizeButton text="Бежевый" onClick={() => updateColor("beige")}
                                selected={color == "beige"}></SizeButton>
                </div>

                <h1 className="text-2xl mb-4 pt-8 pb-2 font-bold text-center">{
                    product != null ?  product!!.price + "р." : ""
                }</h1>

                <button type="button"
                        onClick={() => addToCart(buildModel(color, size))}
                        className="text-white bg-black hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-4 mb-2 mx-2">
                      <ShoppingBagOutlined/> В корзину
                </button>

             <button type="button"
                     onClick={addToFavorite}
                     className="text-black bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm px-5 py-4 mb-2 mx-2">
                      {favorite ? <Favorite/> : <FavoriteBorder/>} {favorite ? "В избранном" : "В избранное"}
                </button>
            </span>
    )
}

function Page() {
    // will resolve data to type Data

    const router = useRouter()

    const [imageIndex, setImageIndex] = useState<number>(0)

    const imageCarouselRefContainer = useRef(null)

    function addToCart(model: Model) {
        const updatedCart = cart()
        updatedCart.items.push(model)

        window.localStorage.setItem("cart", JSON.stringify(updatedCart))
        router.push("/cart")
    }

    function cart(): CartModel {
        const emptyCart = '{ "items": [] }'

        if (typeof window == 'undefined') {
            return CartModelSchema.parse(JSON.parse(emptyCart))
        }

        return CartModelSchema.parse(JSON.parse(window.localStorage.getItem("cart") ?? emptyCart))
    }

    function getWindowSize() {
        if (typeof window !== "undefined") {
            const {innerWidth, innerHeight} = window;
            return {innerWidth, innerHeight};
        }

        return {innerWidth: 0, innerHeight: 0};
    }

    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const isMobile = windowSize.innerWidth <= 800
    const [product, setProduct] = useState<ProductResponse | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/product/id`);
            setProduct(await response.json())
        }

        fetchProduct();
    }, [])

    return (
        <MainLayout>
            <h1 className="text-3xl mb-4 pt-8 pb-4 font-bold">{product?.label ?? ""}</h1>

            <div className={isMobile ? "flex justify-center flex-col mb-16" : "flex justify-center flex-row mb-16"}>

                <div className={isMobile ?
                    "w-full bg-gray-100 rounded-lg dark:border-gray-100 mb-8 flex flex-col justify-between pb-0"
                    : "w-1/2 bg-gray-100 rounded-lg dark:border-gray-100 mr-8 flex flex-col justify-between pb-0"
                }>
                    <div ref={imageCarouselRefContainer}
                         className={clsx("snap-mandatory snap-x flex overflow-x-auto md:overflow-scroll", html)}>
                        {
                            Array.from({length: product?.images.length ?? 0}).map((v) => (
                                <div key={String(v) + "image"} className="flex-shrink-0 snap-center p-8">
                                    <img className="rounded-t-lg"
                                         src="https://storage.yandexcloud.net/ovg-store/img-2.png"
                                         width={isMobile ? "300px" : "300px"}
                                         height={isMobile ? "300px" : "300px"}/>
                                </div>
                            ))
                        }
                    </div>

                    <div className="snap-mandatory snap-x flex overflow-x-auto md:overflow-scroll">
                        {
                            Array.from({length: product?.images.length ?? 0}).map((_, v) => (
                                <button key={String(v) + "preview"}
                                        className={v === imageIndex ?
                                            "flex-shrink-0 snap-center p-2 mx-1 my-2 rounded-lg bg-gray-200 hover:bg-gray-200"
                                            : "flex-shrink-0 snap-center p-2 mx-1 my-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                                        }
                                        onClick={() => {
                                            setImageIndex(v as number);
                                            (imageCarouselRefContainer.current as unknown as Element).scrollTo({
                                                behavior: 'smooth',
                                                left: 150 + 332 * v
                                            })
                                        }}>
                                    <img className="" src="https://storage.yandexcloud.net/ovg-store/img-2.png"
                                         width={isMobile ? "48px" : "48px"}
                                         height={isMobile ? "48px" : "48px"}/>
                                </button>
                            ))
                        }
                    </div>
                </div>

                <div className={isMobile ? "w-full" : "w-1/2"}>
                    <ProductDetails product={product} addToCart={addToCart} isMobile={isMobile}></ProductDetails>
                </div>
            </div>

        </MainLayout>
    )
}

export default Page