import React from 'react';
import Layout from '../components/layout/Layout';
import ProductDetails from '../components/layout/ProductDetails';
import useProducts from '../hooks/useProducts';

const Home = () => {
    const { products } = useProducts('createdAt');

    return (
        <div>
            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {products.map((product) => (
                                <ProductDetails key={product.key} product={product}></ProductDetails>
                            ))}
                        </ul>
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default Home;
