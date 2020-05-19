import React, { useState, useEffect } from 'react';

/**
 * Custom hook for validate forms
 * @param {*} initialState State
 * @param {*} validate Validation rules
 * @param {*} fn Function that executed in the compontent
 */
const useValidation = (initialState, validate, fn) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        if (submitForm) {
            const noErrrors = Object.keys(errors).length === 0;

            if (noErrrors) {
                fn(); // * Fn = Function that executed in the compontent
            }

            setSubmitForm(false);
        }
    }, [errors]);

    /**
     * Function that executed as the user types
     * @param {*} e Event
     */
    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Function that runs when user do submit
     * @param {*} e Event
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        const errorsValidation = validate(values);
        setErrors(errorsValidation);
        setSubmitForm(true);
    };

    /**
     * Function when the blur event takes place
     */
    const handleBlur = () => {
        const errorsValidation = validate(values);
        setErrors(errorsValidation);
    };

    return {
        values,
        errors,
        submitForm,
        handleChange,
        handleSubmit,
        handleBlur,
    };
};

export default useValidation;
