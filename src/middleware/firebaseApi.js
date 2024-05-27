import { collection, query, orderBy, limit, startAt, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const FirebaseApi = {
    // Function to get user data with optional pagination
    getUserData: async (pageSize = 10, lastVisibleDoc = null) => {
        try {
            let q = query(
                collection(db, "users"),
                orderBy("name"),
                limit(pageSize)
            );

            if (lastVisibleDoc) {
                q = query(
                    collection(db, "users"),
                    orderBy("name"),
                    startAt(lastVisibleDoc),
                    limit(pageSize)
                );
            }

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

            return { data, lastVisible };
        } catch (error) {
            console.error("Error getting documents: ", error);
            throw error;
        }
    },

    // Function to add a new user
    addUser: async (userData) => {
        try {
            const docRef = await addDoc(collection(db, "users"), userData);
            return docRef.id;
        } catch (error) {
            console.error("Error adding document: ", error);
            throw error;
        }
    },

    // Function to update a user
    updateUser: async (userId, updatedData) => {
        try {
            const userDoc = doc(db, "users", userId);
            await updateDoc(userDoc, updatedData);
        } catch (error) {
            console.error("Error updating document: ", error);
            throw error;
        }
    },

    // Function to delete a user
    deleteUser: async (userId) => {
        try {
            const userDoc = doc(db, "users", userId);
            await deleteDoc(userDoc);
        } catch (error) {
            console.error("Error deleting document: ", error);
            throw error;
        }
    },

    // Function to get the whitelist
    getWhitelist: async () => {
        try {
            const q = query(
                collection(db, "whitelist")
                // orderBy("email")
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        } catch (error) {
            console.error("Error getting whitelist: ", error);
            throw error;
        }
    }
};

export default FirebaseApi;
