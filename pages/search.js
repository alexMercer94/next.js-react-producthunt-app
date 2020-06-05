import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import ProductDetails from '../components/layout/ProductDetails';
import useProducts from '../hooks/useProducts';

const Search = () => {
    const router = useRouter();
    const {
        query: { q },
    } = router;

    const { products } = useProducts('createdAt');
    const [result, setResult] = useState([]);

    useEffect(() => {
        if (q !== undefined) {
            const search = q.toLowerCase();
            const resultFilter = products.filter((product) => {
                return (
                    product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search)
                );
            });

            setResult(resultFilter);
        }
    }, [q, products]);

    return (
        <div>
            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {result.map((product) => (
                                <ProductDetails key={product.key} product={product}></ProductDetails>
                            ))}
                        </ul>
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default Search;
