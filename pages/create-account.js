import React, { useState } from 'react';
import { css } from '@emotion/core';
import Layout from '../components/layout/Layout';
import { Form, Field, InputSubmit, ErrorMsg } from '../components/ui/Form';
import firebase from '../firebase';
import Router from 'next/router';
// Validations
import useValidation from '../hooks/useValidation';
import validateCreateAcount from '../validation/validateCreateAccount';

const INITIAL_STATE = {
    name: '',
    email: '',
    password: '',
};

const CreateAccount = () => {
    const [error, setError] = useState(false);

    const { values, errors, submitForm, handleChange, handleSubmit, handleBlur } = useValidation(
        INITIAL_STATE,
        validateCreateAcount,
        createAccount
    );

    const { name, email, password } = values;

    async function createAccount() {
        try {
            await firebase.register(name, email, password);
            Router.push('/');
        } catch (error) {
            console.error('Hubo un error al crear el usuario', error.message);
            setError(error.message);
        }
    }

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
                        Crear Cuenta
                    </h1>
                    <Form onSubmit={handleSubmit} noValidate>
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
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Tu Email"
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            ></input>
                        </Field>
                        {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
                        <Field>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Tu password"
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            ></input>
                        </Field>
                        {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
                        {error && <ErrorMsg>{error}</ErrorMsg>}
                        <InputSubmit type="submit" value="Crear Cuenta"></InputSubmit>
                    </Form>
                </>
            </Layout>
        </div>
    );
};

export default CreateAccount;
