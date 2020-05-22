import React, { useEffect, useState } from 'react';
import firebase from '../firebase';

/**
 * Verify and get user's session if exist
 */
function useAuth() {
    const [userAuthenticated, setUserAuthenticated] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                setUserAuthenticated(user);
            } else {
                setUserAuthenticated(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return userAuthenticated;
}

export default useAuth;
