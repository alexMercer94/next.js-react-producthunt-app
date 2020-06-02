import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/layout/Layout';
import { FirebaseContext } from '../firebase';
import ProductDetails from '../components/layout/ProductDetails';

const Home = () => {
    const [products, setProducts] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const getProducts = () => {
            firebase.db.collection('products').orderBy('createdAt', 'desc').onSnapshot(handleSnapshot);
        };

        getProducts();
    }, []);

    /**
     * Access to records
     * @param {*} snapshot Snapshot
     */
    const handleSnapshot = (snapshot) => {
        const products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(products);
        setProducts(products);
    };

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
