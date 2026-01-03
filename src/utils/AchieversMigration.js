// utils/achieverMigration.js
import { message } from 'antd';
import {
    arrayUnion,
    collection,
    deleteDoc,
    doc, getDocs,
    orderBy,
    query,
    setDoc,
    writeBatch
} from 'firebase/firestore';
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
                city: achiever.country,
                country: "indonesia",
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

export const syncAchieversWithFirestore = async (dataDiamond) => {
    try {
        message.loading({ content: 'Analyzing database...', key: 'sync' });

        // 1. Fetch all existing achievers to check for duplicates and find max order
        const achieversRef = collection(db, 'diamondAchiever');
        const snapshot = await getDocs(achieversRef);

        const existingDocsMap = new Map();
        let maxOrder = -1;

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            existingDocsMap.set(doc.id, data);

            // Track the highest order number so we can append new people at the end
            if (typeof data.order === 'number' && data.order > maxOrder) {
                maxOrder = data.order;
            }
        });

        const batch = writeBatch(db);
        let updatesCount = 0;
        let createsCount = 0;

        // 2. Iterate through your local JSON list
        dataDiamond.forEach((item) => {
            // Generate the same deterministic ID from name
            const docId = item.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_')
                .substring(0, 100);

            const docRef = doc(db, 'diamondAchiever', docId);

            // The event string to add (e.g., "2025 The Sound of Asia")
            const newEventName = item.event;

            if (existingDocsMap.has(docId)) {
                // --- CASE 1: USER EXISTS -> UPDATE ONLY ---
                const existingData = existingDocsMap.get(docId);
                const currentEvents = Array.isArray(existingData.event) ? existingData.event : [];

                // Only update if this specific event is NOT already in their list
                if (!currentEvents.includes(newEventName)) {
                    batch.update(docRef, {
                        event: arrayUnion(newEventName) // Safely adds to array without deleting old events
                    });
                    updatesCount++;
                }
            } else {
                // --- CASE 2: USER DOES NOT EXIST -> CREATE NEW ---
                maxOrder++; // Increment order so they show up at the bottom

                const newDocData = {
                    name: item.name,
                    city: item.city || "Jakarta",
                    country: "indonesia", // Enforce string
                    YoutubeLink: item.YoutubeLink || "",
                    event: [newEventName], // Start array with this event
                    createdAt: new Date().toISOString(),
                    order: maxOrder
                };

                batch.set(docRef, newDocData);
                createsCount++;
            }
        });

        // 3. Commit changes to Firestore
        if (updatesCount > 0 || createsCount > 0) {
            await batch.commit();
            message.success({
                content: `Sync Success! Created ${createsCount} new, Updated ${updatesCount} existing.`,
                key: 'sync',
                duration: 5
            });
            console.log(`✅ Database Updated: ${createsCount} created, ${updatesCount} updated.`);
        } else {
            message.info({ content: 'Database is already up to date.', key: 'sync' });
        }

        return { success: true, creates: createsCount, updates: updatesCount };

    } catch (error) {
        console.error('Sync error:', error);
        message.error({ content: 'Failed to sync data.', key: 'sync' });
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