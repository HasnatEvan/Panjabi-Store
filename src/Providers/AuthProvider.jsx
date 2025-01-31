import { createContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import { app } from "../FireBase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider(); // ✅ Fixed instantiation

    // ✅ Create a new user with email & password
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // ✅ Login user with email & password
    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // ✅ Sign in with Google
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // ✅ Logout user
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    // ✅ Update user profile
    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        });
    };

    // ✅ Listen for user authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("Current User -->", currentUser?.email);
            setUser(currentUser);
    
            if (currentUser?.email) {
                try {
                    // Save User Info in DB
                    // await axios.post(
                    //     `http://localhost:5000/users/${currentUser?.email}`, // Correct URL with email in path
                    //     {
                    //         name: currentUser?.displayName,
                    //         image: currentUser?.photoURL,
                    //         email: currentUser?.email,
                    
                    //     }
                    // );
    
                    // ✅ Get JWT token
                    await axios.post(
                        "http://localhost:5000/jwt",
                        { email: currentUser.email },
                        { withCredentials: true }
                    );
                } catch (error) {
                    console.error("Error while saving user info:", error);
                    alert("There was an error saving the user information!");
                }
            } else {
                // ✅ Logout request
                await axios.get("http://localhost:5000/logout", {
                    withCredentials: true,
                });
            }
            setLoading(false);
        });
    
        return () => unsubscribe(); // Clean up listener on unmount
    }, []);
    

    // ✅ Provide authentication functions & state to children
    const authInfo = {
        user,
        loading,
        createUser,
        loginUser,
        googleSignIn,
        logOut,
        updateUserProfile // ✅ Corrected function reference
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
