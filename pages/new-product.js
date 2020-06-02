import React, { useState, useContext } from 'react';
import { css } from '@emotion/core';
import Layout from '../components/layout/Layout';
import { Form, Field, InputSubmit, ErrorMsg } from '../components/ui/Form';
import { FirebaseContext } from '../firebase';
import Router, { useRouter } from 'next/router';
// Validations
import useValidation from '../hooks/useValidation';
import validateCreateProduct from '../validation/validateCreateProduct';
import { firestore } from 'firebase';
import FileUploader from 'react-firebase-file-uploader';

const INITIAL_STATE = {
    name: '',
    company: '',
    // image: '',
    url: '',
    description: '',
};

const NewProduct = () => {
    // Image's state
    const [imageName, setImageName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageURL, setImageURL] = useState('');

    const [error, setError] = useState(false);

    const { values, errors, submitForm, handleChange, handleSubmit, handleBlur } = useValidation(
        INITIAL_STATE,
        validateCreateProduct,
        createProduct
    );

    const { name, company, url, image, description } = values;

    // Routing Hook in order to redirect
    const router = useRouter();

    // Context with CRUD Firebase operations
    const { user, firebase } = useContext(FirebaseContext);

    async function createProduct() {
        // If user is not authenticated redirect to login
        if (!user) {
            return router.push('/login');
        }

        // Create new product's object
        const product = {
            name,
            company,
            url,
            imageURL,
            description,
            votes: 0,
            comments: [],
            createdAt: Date.now(),
            creator: {
                id: user.uid,
                name: user.displayName,
            },
        };

        // Insert product in database
        firebase.db.collection('products').add(product);

        return router.push('/');
    }

    const handleUploadStart = () => {
        setProgress(0);
        setUploading(true);
    };

    const handleProgress = (progress) => setProgress({ progress });
    const handleUploadError = (error) => {
        setUploading(error);
        console.error(error);
    };
    const handleUploadSuccess = (filename) => {
        setProgress(100);
        setUploading(false);
        setImageName(filename);
        firebase.storage
            .ref('products')
            .child(filename)
            .getDownloadURL()
            .then((url) => {
                console.log(url);
                setImageURL(url);
            });
    };

    return (
        <div>
            <Layout>
                <>
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >
                        Nuevo Producto
                    </h1>
                    <Form onSubmit={handleSubmit} noValidate>
                        <fieldset>
                            <legend>Información General</legend>
                            <Field>
                                <label htmlFor="name">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Tu nombre"
                                    value={name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                ></input>
                            </Field>
                            {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
                            <Field>
                                <label htmlFor="company">Empresa</label>
                                <input
                                    type="text"
                                    name="company"
                                    id="company"
                                    placeholder="Nombre de la Empresasa o Compañia"
                                    value={company}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                ></input>
                            </Field>
                            {errors.company && <ErrorMsg>{errors.company}</ErrorMsg>}
                            <Field>
                                <label htmlFor="image">Imagen</label>
                                <FileUploader
                                    accept="image/*"
                                    name="image"
                                    id="image"
                                    randomizeFilename
                                    storageRef={firebase.storage.ref('products')}
                                    onUploadStart={handleUploadStart}
                                    onUploadError={handleUploadError}
                                    onUploadSuccess={handleUploadSuccess}
                                    onProgress={handleProgress}
                                ></FileUploader>
                            </Field>
                            {errors.image && <ErrorMsg>{errors.image}</ErrorMsg>}
                            <Field>
                                <label htmlFor="url">URL</label>
                                <input
                                    type="url"
                                    name="url"
                                    id="url"
                                    placeholder="URL de tu producto"
                                    value={url}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                ></input>
                            </Field>
                            {errors.url && <ErrorMsg>{errors.url}</ErrorMsg>}
                        </fieldset>
                        <fieldset>
                            <legend>Sobre tu producto</legend>
                            <Field>
                                <label htmlFor="description">Descripción</label>
                                <textarea
                                    name="description"
                                    id="description"
                                    value={description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                ></textarea>
                            </Field>
                            {errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
                        </fieldset>

                        {error && <ErrorMsg>{error}</ErrorMsg>}
                        <InputSubmit type="submit" value="Crear Producto"></InputSubmit>
                    </Form>
                </>
            </Layout>
        </div>
    );
};

export default NewProduct;
