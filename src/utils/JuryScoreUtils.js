import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Get all jury scores for a specific registrant
 * @param {string} registrantId - The registrant's document ID
 * @returns {Promise<Array>} Array of scores with jury info
 */
export const getRegistrantScores = async (registrantId) => {
    try {
        const q = query(
            collection(db, 'JuryScores2025'),
            where('registrantId', '==', registrantId)
        );

        const snapshot = await getDocs(q);

        const scores = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() // Convert Firestore timestamp
        }));

        // Sort by timestamp (newest first)
        scores.sort((a, b) => b.timestamp - a.timestamp);

        return scores;
    } catch (error) {
        console.error('Error fetching registrant scores:', error);
        return [];
    }
};

/**
 * Calculate average score for a registrant
 * @param {string} registrantId 
 * @returns {Promise<number>} Average score (0-100)
 */
export const getAverageScore = async (registrantId) => {
    try {
        const scores = await getRegistrantScores(registrantId);

        if (scores.length === 0) return null;

        const validScores = scores.filter(s =>
            typeof s.score === 'number' &&
            s.score >= 0 &&
            s.score <= 100
        );

        if (validScores.length === 0) return null;

        const sum = validScores.reduce((acc, s) => acc + s.score, 0);
        return Math.round(sum / validScores.length * 100) / 100; // Round to 2 decimals
    } catch (error) {
        console.error('Error calculating average:', error);
        return null;
    }
};

/**
 * Get all comments for a registrant (formatted for display)
 * @param {string} registrantId 
 * @returns {Promise<Array>} Array of formatted comments
 */
export const getRegistrantComments = async (registrantId) => {
    try {
        const scores = await getRegistrantScores(registrantId);

        return scores.map(score => ({
            juryName: score.juryName || 'Anonymous Jury',
            juryEmail: score.juryEmail,
            score: score.score,
            comment: score.comment || 'No comment provided',
            timestamp: score.timestamp,
            formattedDate: score.timestamp
                ? score.timestamp.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                : 'Unknown date'
        }));
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
};

/**
 * Get statistics for a registrant's scores
 * @param {string} registrantId 
 * @returns {Promise<Object>} Statistics object
 */
export const getScoreStatistics = async (registrantId) => {
    try {
        const scores = await getRegistrantScores(registrantId);

        const validScores = scores
            .filter(s => typeof s.score === 'number' && s.score >= 0 && s.score <= 100)
            .map(s => s.score);

        if (validScores.length === 0) {
            return {
                average: null,
                min: null,
                max: null,
                count: 0,
                hasComments: false
            };
        }

        const average = validScores.reduce((a, b) => a + b, 0) / validScores.length;

        return {
            average: Math.round(average * 100) / 100,
            min: Math.min(...validScores),
            max: Math.max(...validScores),
            count: validScores.length,
            totalJury: scores.length,
            hasComments: scores.some(s => s.comment && s.comment.trim() !== '')
        };
    } catch (error) {
        console.error('Error calculating statistics:', error);
        return null;
    }
};

/**
 * Get all scores by a specific jury
 * @param {string} juryUserId 
 * @returns {Promise<Array>} Array of scores
 */
export const getJuryScores = async (juryUserId) => {
    try {
        const q = query(
            collection(db, 'JuryScores2025'),
            where('juryUserId', '==', juryUserId)
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
        }));
    } catch (error) {
        console.error('Error fetching jury scores:', error);
        return [];
    }
};

/**
 * Export comments to send to registrant (formatted as HTML/text)
 * @param {string} registrantId 
 * @returns {Promise<string>} Formatted comments
 */
export const exportCommentsForEmail = async (registrantId) => {
    try {
        const comments = await getRegistrantComments(registrantId);
        const stats = await getScoreStatistics(registrantId);

        if (comments.length === 0) {
            return 'No jury feedback available yet.';
        }

        let output = `<h3>Jury Feedback Summary</h3>`;

        if (stats) {
            output += `<p><strong>Average Score:</strong> ${stats.average}/100</p>`;
            output += `<p><strong>Score Range:</strong> ${stats.min} - ${stats.max}</p>`;
            output += `<p><strong>Total Evaluations:</strong> ${stats.count}</p>`;
            output += `<hr/>`;
        }

        comments.forEach((comment, index) => {
            output += `
                <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-left: 4px solid #EBBC64;">
                    <p><strong>Jury ${index + 1}</strong> - ${comment.formattedDate}</p>
                    <p><strong>Score:</strong> ${comment.score}/100</p>
                    <p><strong>Comment:</strong></p>
                    <p>${comment.comment}</p>
                </div>
            `;
        });

        return output;
    } catch (error) {
        console.error('Error exporting comments:', error);
        return 'Error generating feedback.';
    }
};

/**
 * Check if a jury has already scored a registrant
 * @param {string} registrantId 
 * @param {string} juryUserId 
 * @returns {Promise<boolean>}
 */
export const hasJuryScored = async (registrantId, juryUserId) => {
    try {
        const docId = `${registrantId}_${juryUserId}`;
        const docRef = doc(db, 'JuryScores2025', docId);
        const docSnap = await getDoc(docRef);

        return docSnap.exists();
    } catch (error) {
        console.error('Error checking jury score:', error);
        return false;
    }
};