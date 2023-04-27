import styles from './index.module.css'
import type {NextPage} from "next"
import React, {useEffect, useState} from "react";
import {MainLayout} from "../../components/Layout";
import {Card} from "../../components/Card";
import clsx from "clsx";
import {useRouter} from "next/router";
// @ts-ignore
import {ProductResponse} from "../../models/response/ProductResponse";
import {FavoriteModel, FavoriteModelSchema} from "../../models/Favorite";
import {CartModelSchema} from "../../models/Cart";


const EmptyFavorite: React.FC<{ action: Function }> = ({action}) => {
    return (
        <div className="py-32 flex flex-col items-center justify-center">
            <h2 className="text-2xl pt-8 font-bold">В избранном пусто</h2>
            <h2 className="text-medium pt-4 font-medium pb-4 text-center">
                Добавьте товары в избранное на главной странице
            </h2>
            <button type="button"
                    onClick={() => action()}
                    className="text-black bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm px-5 py-4 mb-2 mx-2">
                На главную
            </button>
        </div>
    )
}

const Favorite: React.FC<{ products: ProductResponse[], updateFavorite: Function }> = ({products, updateFavorite}) => {
    return (
        <div className={clsx("grid gap-4", styles.grid)}>
            {
                products.map((product) => (
                    <Card key="${v}"
                          product={product}
                          selectedByDefault={true}
                          onUpdate={updateFavorite}
                          onPress={() => {
                          }}
                    />
                ))
            }
        </div>
    )
}


const Home: NextPage = () => {

    function favorite(): FavoriteModel {
        const emptyFavorite = JSON.stringify({items: []})

        if (typeof window == 'undefined') {
            return FavoriteModelSchema.parse(JSON.parse(emptyFavorite))
        }

        return FavoriteModelSchema.parse(JSON.parse(window.localStorage.getItem("favorite") ?? emptyFavorite))
    }

    function updateFavorite(newValue: FavoriteModel) {
        window.localStorage.setItem("favorite", JSON.stringify(newValue))
    }

    const router = useRouter()

    const [products, setProducts] = useState<ProductResponse[] | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            // post call
            const ids: FavoriteModel = favorite()
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/product/` + ids.items[0]);

            const product = await response.json()
            setProducts(Array.from({length: ids.items.length}).map((v) => product));
        }

        fetchProducts();
    }, []);

    if (products == null) {
        return (<MainLayout>
            <h1 className="text-3xl mb-4 pt-8 font-bold">Избранное</h1>
        </MainLayout>)
    }

    return (
        <MainLayout>
            <h1 className="text-3xl mb-4 pt-8 font-bold">Избранное</h1>

            {
                products!!.length > 0 ?
                    <Favorite products={products} updateFavorite={updateFavorite}/> :
                    <EmptyFavorite action={() => router.push("/")}/>
            }
        </MainLayout>
    )
}

export default Home