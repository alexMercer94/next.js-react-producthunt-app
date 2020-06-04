import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../firebase';

const useProducts = (order) => {
    const [products, setProducts] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const getProducts = () => {
            firebase.db.collection('products').orderBy(order, 'desc').onSnapshot(handleSnapshot);
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

        setProducts(products);
    };

    return {
        products,
    };
};

export default useProducts;
