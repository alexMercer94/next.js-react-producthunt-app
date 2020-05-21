import app from 'firebase/app';
import firebaseConfig from './config';
import 'firebase/auth';

class Firebase {
    constructor() {
        if (!app.apps.length) {
            app.initializeApp(firebaseConfig);
        }

        this.auth = app.auth();
    }

    /**
     * Register a user
     * @param {*} name
     * @param {*} email
     * @param {*} password
     */
    async register(name, email, password) {
        const newUser = await this.auth.createUserWithEmailAndPassword(email, password);

        return await newUser.user.updateProfile({
            displayName: name,
        });
    }
}

const firebase = new Firebase();
export default firebase;
