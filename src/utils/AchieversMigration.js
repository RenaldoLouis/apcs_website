// utils/achieverMigration.js
import { message } from 'antd';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * ONE-TIME MIGRATION: Upload all achievers to Firestore
 * Run this once from your admin panel or console
 */
export const migrateAchieversToFirestore = async (dataDiamond) => {
    try {
        const batch = writeBatch(db);
        const achieversRef = collection(db, 'diamondAchiever');

        dataDiamond.forEach((achiever, index) => {
            // Generate a clean ID from name (remove spaces, special chars)
            const docId = achiever.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_')
                .substring(0, 100); // Firestore ID limit

            const achieverDoc = doc(achieversRef, docId);

            batch.set(achieverDoc, {
                name: achiever.name,
                country: achiever.country,
                YoutubeLink: achiever.YoutubeLink || "",
                event: achiever.event || [],
                createdAt: new Date().toISOString(),
                order: index // Preserve original order
            });
        });

        await batch.commit();
        message.success(`Successfully migrated ${dataDiamond.length} achievers to Firestore!`);
        console.log(`✅ Migrated ${dataDiamond.length} achievers`);

        return { success: true, count: dataDiamond.length };
    } catch (error) {
        console.error('Migration error:', error);
        message.error('Failed to migrate achievers');
        return { success: false, error };
    }
};

/**
 * Fetch all achievers from Firestore
 */
export const fetchAchieversFromFirestore = async () => {
    try {
        const achieversRef = collection(db, 'diamondAchiever');
        const q = query(achieversRef, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);

        const achievers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`✅ Fetched ${achievers.length} achievers from Firestore`);
        return achievers;
    } catch (error) {
        console.error('Error fetching achievers:', error);
        message.error('Failed to load achievers');
        return [];
    }
};

/**
 * Add a new achiever to Firestore
 */
export const addAchieverToFirestore = async (achieverData) => {
    try {
        const docId = achieverData.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .substring(0, 100);

        const achieverDoc = doc(db, 'diamondAchiever', docId);

        await setDoc(achieverDoc, {
            name: achieverData.name,
            country: achieverData.country,
            YoutubeLink: achieverData.YoutubeLink || "",
            event: achieverData.event || [],
            createdAt: new Date().toISOString(),
            order: achieverData.order || 999 // Default to end
        });

        message.success('Achiever added successfully!');
        return { success: true, id: docId };
    } catch (error) {
        console.error('Error adding achiever:', error);
        message.error('Failed to add achiever');
        return { success: false, error };
    }
};

/**
 * Update an existing achiever
 */
export const updateAchieverInFirestore = async (achieverId, updates) => {
    try {
        const achieverDoc = doc(db, 'diamondAchiever', achieverId);

        await setDoc(achieverDoc, {
            ...updates,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        message.success('Achiever updated successfully!');
        return { success: true };
    } catch (error) {
        console.error('Error updating achiever:', error);
        message.error('Failed to update achiever');
        return { success: false, error };
    }
};

/**
 * Delete an achiever
 */
export const deleteAchieverFromFirestore = async (achieverId) => {
    try {
        const achieverDoc = doc(db, 'diamondAchiever', achieverId);
        await deleteDoc(achieverDoc);

        message.success('Achiever deleted successfully!');
        return { success: true };
    } catch (error) {
        console.error('Error deleting achiever:', error);
        message.error('Failed to delete achiever');
        return { success: false, error };
    }
};

/**
 * Filter achievers by event
 */
export const filterAchieversByEvent = (achievers, eventKey) => {
    if (!eventKey || eventKey === 'all') return achievers;

    return achievers.filter(achiever =>
        achiever.event && achiever.event.includes(eventKey)
    );
};

/**
 * Filter achievers by city
 */
export const filterAchieversByCity = (achievers, cityKey) => {
    if (!cityKey || cityKey === 'all') return achievers;

    return achievers.filter(achiever =>
        achiever.country === cityKey
    );
};

/**
 * Search achievers by name
 */
export const searchAchieversByName = (achievers, searchTerm) => {
    if (!searchTerm) return achievers;

    const term = searchTerm.toLowerCase();
    return achievers.filter(achiever =>
        achiever.name.toLowerCase().includes(term)
    );
};