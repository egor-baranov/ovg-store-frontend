import styles from './index.module.css'
import type {GetStaticProps, GetStaticPropsResult, InferGetStaticPropsType, NextPage} from "next"
import {MainLayout} from "../components/Layout"
import {Card} from "../components/Card";
import clsx from "clsx";
import {Footer} from "../components/Footer";
import React, {ReactNode, useEffect, useState} from "react";
import {func} from "prop-types";
import {CartModelSchema} from "../models/Cart";
import useSWR from 'swr'
import {loadProducts} from '../lib/load-products'
import {useSession} from 'next-auth/react'
import {map} from "yandex-maps";

export type Product = {
    id: string
    label: string
    description: string
    price: string
    sizes: string[]
    colors: string[]
    images: string[]
}

export type CategoriesResponse = {
    categories: Map<string, Product[]>
}

export async function getStaticProps(): Promise<GetStaticPropsResult<HomeProps>> {
    const res = await fetch(
        process.env.BACKEND_URL + '/category/all',
        {
            headers: {
                Authorization: `${process.env.ACCESS_TOKEN}`
            }
        }
    )
    const categoriesResponse: CategoriesResponse = await res.json()
    const categories = categoriesResponse.categories

    return {
        props: {
            categories
        },
    }
}

interface HomeProps {
    categories: Map<string, Product[]>
}

// @ts-ignore
const Home: React.FC<HomeProps> = (props: HomeProps) => {

    function addToFavorite() {

    }

    if (props.categories === undefined) {
        return
    }

    return (
        <MainLayout>
            {Array.from(
                new Map<string, Product[]>(
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
                                  id={item.id}
                                  label={item.label}
                                  price={item.price}
                                  imageUrl={""}
                                  selectedByDefault={false} onUpdate={addToFavorite}></Card>
                        ))}
                    </div>
                </div>
            ))}

            <div className="pb-16"/>
        </MainLayout>
    )
}

export default Home