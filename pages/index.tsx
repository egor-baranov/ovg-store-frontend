import styles from './index.module.css'
import {MainLayout} from "../components/Layout"
import {Card} from "../components/Card";
import clsx from "clsx";
import React, {ReactNode, useEffect, useState} from "react";
import {ProductResponse} from "../models/response/ProductResponse";
import {CategoriesResponse} from "../models/response/CategoriesResponse";
import {useRouter} from "next/router";

// @ts-ignore
const Home: React.FC = () => {

    const router = useRouter()

    async function openProduct(product: ProductResponse) {
        await router.push('/product/' + product.id)
    }

    function addToFavorite() {

    }

    const [categories, setCategories] = useState<Map<string, ProductResponse[]> | null>(null);
    const [titleIds, setTitleIds] = useState<Map<string, string> | null>(null);

    useEffect(() => {
        async function fetchCategories() {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROOT}/category/all`,
            )

            const categoriesResponse: CategoriesResponse = await response.json()
            setCategories(categoriesResponse.categories)
            setTitleIds(new Map<string, string>(
                Object.entries(categoriesResponse.titleIds)
            ))
        }

        fetchCategories();
    }, [])

    if (!categories) {
        return (<MainLayout>
            <h1 className="text-3xl mb-4 pt-16 font-bold">Loading...</h1>
        </MainLayout>)
    }

    return (
        <MainLayout>
            {Array.from(
                new Map<string, ProductResponse[]>(
                    Object.entries(categories)
                ).entries()
            ).map((v) => (
                <div key={"title" + v[0]}>
                    <h1 id={titleIds!!.get(v[0])} className="text-3xl mb-4 pt-16 font-bold">{
                        v[0]
                    }</h1>

                    <div className={clsx("grid gap-4", styles.grid)}>
                        {Array.from(v[1]).map((item) => (
                            <Card key={item.id}
                                  product={item}
                                  selectedByDefault={false}
                                  onUpdate={addToFavorite}
                                  onPress={() => openProduct(item)}
                            />
                        ))}
                    </div>
                </div>
            ))}

            <div className="pb-16"/>
        </MainLayout>
    )
}

export default Home