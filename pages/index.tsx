import styles from './index.module.css'
import type {GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType, NextPage} from "next"
import {MainLayout} from "../components/Layout"
import {Card} from "../components/Card";
import clsx from "clsx";
import React, {ReactNode, useEffect, useState} from "react";
import {ProductResponse} from "../models/response/ProductResponse";
import {CategoriesResponse} from "../models/response/CategoriesResponse";
import {useRouter} from "next/router";

export async function getStaticProps(): Promise<GetStaticPropsResult<HomeProps>> {
    const res = await fetch(
        process.env.BACKEND_URL + '/category/all',
        {
            headers: {
                Authorization: `${process.env.ACCESS_TOKEN}`
            }
        }
    )

    if (!res.ok) {
        throw new Error('Failed to fetch data: ' + res.status);
    }

    const categoriesResponse: CategoriesResponse = await res.json()
    const categories = categoriesResponse.categories

    return {
        props: {
            categories
        },
    }
}

interface HomeProps {
    categories: Map<string, ProductResponse[]>
}

// @ts-ignore
const Home: React.FC<HomeProps> = (props: HomeProps) => {

    const router = useRouter()

    async function openProduct(product: ProductResponse) {
        await router.push('/product/' + product.id)
    }

    function addToFavorite() {

    }

    useEffect(() => {
            router.prefetch('/product/id')
        },
        [router]
    )

    if (props.categories === undefined) {
        return
    }

    return (
        <MainLayout>
            {Array.from(
                new Map<string, ProductResponse[]>(
                    Object.entries(props!!.categories)
                ).entries()
            ).map((v) => (
                <div key={"title" + v[0]}>
                    <h1 id={"label" + v[0]} className="text-3xl mb-4 pt-16 font-bold">{
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