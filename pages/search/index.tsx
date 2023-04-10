import type {NextPage} from "next"
import React from "react";
import {MainLayout} from "../../components/Layout";
import {SearchBar} from "../../components/SearchBar";

const Search: NextPage = () => {
    return (
        <MainLayout>
            <h1 className="text-3xl mb-4 pt-8 pb-4 font-bold">Поиск</h1>

            <SearchBar></SearchBar>
        </MainLayout>
    )
}

export default Search