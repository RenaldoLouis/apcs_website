import { Button, Form, Input, Layout, message, Modal, Pagination, Progress, Select, Space, Table, theme } from 'antd';
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import JSZip from "jszip";
import * as xlsx from 'xlsx';
import apis from '../../apis';
import { getRegistrants2025Columns } from '../../constant/RegistrantsColumn';
import { db } from '../../firebase';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';

import { collection, getDocs, writeBatch } from "firebase/firestore";
import { useState } from 'react';
import { extractVideoId, fetchYouTubeDuration } from '../../utils/youtube';
// Import the new utility functions
import {
    ageCategories,
    brassAgeCategoriesEnsemble,
    brassAgeCategoriesSolo,
    competitionList,
    ensembleAgeCategories,
    guitarAgeCategoriesEnsemble,
    guitarAgeCategoriesSolo,
    harpAgeCategoriesEnsemble,
    harpAgeCategoriesSolo,
    PercussionAgeCategoriesEnsemble,
    percussionAgeCategoriesSolo,
    stringAgeCategoriesEnsemble,
    stringAgeCategoriesSolo,
    vocalAgeCategoriesEnsemble,
    vocalAgeCategoriesSolo,
    woodwinAgeCategoriesEnsemble,
    woodwinAgeCategoriesSolo
} from '../../constant/RegisterPageConst';
import { parseDateString } from '../../utils/Utils';

// ...other imports
const { Content } = Layout;

const RegistrantDashboard = () => {
    const competitionCategoryOptions = Object.values(competitionList).map(cat => ({ value: cat, label: cat }));

    const ageCategoryOptions = Object.keys(ageCategories).map(key => ({ value: key, label: ageCategories[key] }));

    const performanceCategoryOptions = [
        { value: 'Solo', label: 'Solo' },
        { value: 'Ensemble', label: 'Ensemble' },
    ];
    const pageSize = 10

    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    const [isUploading, setIsUploading] = useState(false);

    // --- NEW STATE FOR THE EDIT MODAL ---
    const [editFormState, setEditFormState] = useState({
        firstName: '',
        lastName: '',
        youtubeLink: '',
        ageCategory: '',
        email: "",
    });
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [ageFilter, setAgeFilter] = useState(null); // null means "All"
    const [performanceFilter, setPerformanceFilter] = useState(null);
    // 1. Add state to hold the current search term
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTeacherName, setSearchTeacherName] = useState('');
    const [competitionFilter, setCompetitionFilter] = useState(null);

    const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
    const [teacherStats, setTeacherStats] = useState([]);

    // 2. Pass the searchTerm to your updated hook
    const {
        allData,
        registrantDatas,
        loading,
        error,
        page,
        setPage,
        totalPages,
        totalDocs,
        fetchData: fetchUserData,
    } = usePaginatedRegistrants(pageSize, "Registrants2025", "createdAt", searchTerm, searchTeacherName, ageFilter,
        performanceFilter, competitionFilter);

    // --- State for the new update process ---
    const [isUpdating, setIsUpdating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [updateMessage, setUpdateMessage] = useState('');

    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);

    const getAgeCategoryLabel = (ageCategoryKey, competitionCategory, performanceCategory) => {
        if (!ageCategoryKey) return '';

        // Create a combined map of all age categories
        const allAgeCategories = {
            // Piano
            ...ageCategories,
            ...ensembleAgeCategories,

            // Strings
            ...stringAgeCategoriesSolo,
            ...stringAgeCategoriesEnsemble,

            // Vocal/Choir
            ...vocalAgeCategoriesSolo,
            ...vocalAgeCategoriesEnsemble,

            // Woodwinds
            ...woodwinAgeCategoriesSolo,
            ...woodwinAgeCategoriesEnsemble,

            // Percussion
            ...percussionAgeCategoriesSolo,
            ...PercussionAgeCategoriesEnsemble,

            // Guitar
            ...guitarAgeCategoriesSolo,
            ...guitarAgeCategoriesEnsemble,

            // Brass
            ...brassAgeCategoriesSolo,
            ...brassAgeCategoriesEnsemble,

            // Harp
            ...harpAgeCategoriesSolo,
            ...harpAgeCategoriesEnsemble,
        };

        // Return the full description or the key if not found
        return allAgeCategories[ageCategoryKey] || ageCategoryKey;
    };

    const handlePageChange = (pagination, filters, sorter, extra) => {
        setPage(pagination);
    };

    const stripS3Prefix = (uri) => {
        const parts = uri.split('/');
        // Remove 's3:', '', 'bucket-name'
        return parts.slice(3).join('/');
    };

    const handleCompetitionFilterChange = (value) => {
        setPage(1); // Reset to page 1 when filter changes
        setCompetitionFilter(value);
    };

    async function createAndDownloadZip(pdfBlobs) {
        console.log("pdfBlobs", pdfBlobs)
        const zip = new JSZip();

        for (let i = 0; i < pdfBlobs.length; i++) {
            const blob = pdfBlobs[i];
            let currentData = registrantDatas[i]
            zip.file(`${currentData.name}-${i}.pdf`, blob);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "registrant.zip");
    }

    const handleAgeFilterChange = (value) => {
        setPage(1); // Reset to page 1 when filter changes
        setAgeFilter(value);
    };

    const handlePerformanceFilterChange = (value) => {
        setPage(1); // Reset to page 1 when filter changes
        setPerformanceFilter(value);
    };


    // --- NEW FUNCTION to calculate and show teacher stats ---
    const handleShowStatsModal = () => {
        if (!allData || allData.length === 0) {
            message.info("No data to generate statistics.");
            return;
        }

        // Helper to get a consistent teacher name from a record
        const getTeacherName = (registrant) => {
            const name = registrant.teacherName || (registrant.userType === 'Teacher' ? registrant.name : null);
            return name ? name.trim() : null;
        };

        // Use reduce to group registrations by teacher and count their performance types
        const stats = allData.reduce((acc, registrant) => {
            const teacher = getTeacherName(registrant);
            if (teacher) {
                // If we haven't seen this teacher before, initialize their entry
                if (!acc[teacher]) {
                    acc[teacher] = {
                        key: teacher,
                        teacherName: teacher,
                        soloCount: 0,
                        ensembleCount: 0,
                    };
                }

                // Increment the count based on the performance category
                const perfCategory = (registrant.PerformanceCategory || '').trim().toLowerCase();
                if (perfCategory === 'solo') {
                    acc[teacher].soloCount += 1;
                } else if (perfCategory === 'ensemble') {
                    acc[teacher].ensembleCount += 1;
                }
            }
            return acc;
        }, {});

        // Convert the stats object to an array and sort by teacher name
        const statsArray = Object.values(stats).sort((a, b) => a.teacherName.localeCompare(b.teacherName));

        setTeacherStats(statsArray);
        setIsStatsModalVisible(true);
    };

    const handleExportTeacherStats = () => {
        if (!teacherStats || teacherStats.length === 0) {
            message.warn("No stats data to export.");
            return;
        }

        message.info("Preparing teacher stats Excel file...");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Teacher Registration Stats");

        // Define the headers for your table
        worksheet.getRow(1).values = ['Teacher Name', 'Solo Registrations', 'Ensemble Registrations'];
        worksheet.getRow(1).font = { bold: true };

        // Add the data from your teacherStats array
        teacherStats.forEach(stat => {
            worksheet.addRow([
                stat.teacherName,
                stat.soloCount,
                stat.ensembleCount
            ]);
        });

        // Auto-fit columns
        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 15 ? 15 : maxLength + 2;
        });

        // Generate and download the file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            FileSaver.saveAs(blob, "Teacher_Stats_2025.xlsx");
        });
    };

    const statsColumns = [
        { title: 'Teacher Name', dataIndex: 'teacherName', key: 'teacherName', sorter: (a, b) => a.teacherName.localeCompare(b.teacherName) },
        { title: 'Solo Registrations', dataIndex: 'soloCount', key: 'soloCount', sorter: (a, b) => a.soloCount - b.soloCount },
        { title: 'Ensemble Registrations', dataIndex: 'ensembleCount', key: 'ensembleCount', sorter: (a, b) => a.ensembleCount - b.ensembleCount },
    ];

    const handleDeleteRegistrant = async (recordId) => {
        setDeletingId(recordId);
        try {
            // 1. Create a reference to the document to be deleted
            const docRef = doc(db, 'Registrants2025', recordId);

            // 2. Call Firestore's deleteDoc function
            await deleteDoc(docRef);

            message.success('Registrant deleted successfully!');

            // 3. Refresh the table data. It's often best to go back to page 1.
            if (page !== 1) setPage(1);
            fetchUserData(1);

        } catch (error) {
            console.error("Error deleting registrant: ", error);
            message.error('Failed to delete registrant.');
        } finally {
            setDeletingId(null); // Clear the loading state
        }
    };

    // 1. ADD THESE HELPER FUNCTIONS
    // This function takes an S3 URI like "s3://bucket/key..." and returns just the object key.
    const getS3KeyFromUri = (uri) => {
        if (!uri) return '';
        // This splits the string by slashes and takes everything after the 3rd slash.
        return uri.split('/').slice(3).join('/');
    };

    // This function takes an object key and constructs the full public HTTPS URL.
    const constructS3PublicUrl = (s3Key) => {
        const BUCKET_NAME = 'registrants2025';
        // Make sure this is your bucket's actual region
        const BUCKET_REGION = 'ap-southeast-1';
        return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${s3Key}`;
    };

    function formatDuration(totalSeconds) {
        // Handle non-numeric or negative inputs gracefully
        if (isNaN(totalSeconds) || totalSeconds < 0) {
            return "00:00";
        }

        // 1. Calculate the minutes by dividing by 60 and taking the integer part
        const minutes = Math.floor(totalSeconds / 60);

        // 2. Calculate the remaining seconds using the modulo operator
        const seconds = totalSeconds % 60;

        // 3. Pad both numbers with a leading zero if they are less than 10
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        // 4. Combine them into the final format
        return `${paddedMinutes}:${paddedSeconds}`;
    }

    const handleExportToExcel = () => {
        if (!allData || allData.length === 0) {
            message.warn("No data available to export.");
            return;
        }

        message.info("Grouping data and preparing your multi-sheet Excel file...");

        // --- 1. GROUP ALL DATA BY COMPETITION CATEGORY ---
        const groupedByCategory = allData.reduce((acc, registrant) => {
            const category = registrant.competitionCategory || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(registrant);
            return acc;
        }, {});

        // --- Duplicate detection logic ---
        const linkCounts = allData.reduce((acc, registrant) => {
            const link = registrant.youtubeLink;
            if (link) {
                acc[link] = (acc[link] || 0) + 1;
            }
            return acc;
        }, {});

        const duplicateTags = {};
        let duplicateCounter = 1;
        for (const link in linkCounts) {
            if (linkCounts[link] > 1) {
                duplicateTags[link] = `duplicate${duplicateCounter}`;
                duplicateCounter++;
            }
        }

        const workbook = new ExcelJS.Workbook();

        // --- 2. LOOP THROUGH EACH CATEGORY AND CREATE A SHEET FOR IT ---
        for (const category in groupedByCategory) {
            const worksheet = workbook.addWorksheet(category.substring(0, 30));
            const categoryData = groupedByCategory[category];

            // --- 3. PROCESS AND MAP DATA FOR THE CURRENT SHEET ---
            const dataForSheet = [];
            categoryData.forEach(registrant => {
                const originalRowNumber = allData.findIndex(item => item.id === registrant.id) + 1;

                // ✨ MAP AGE CATEGORY TO FULL DESCRIPTION
                const ageCategoryLabel = getAgeCategoryLabel(
                    registrant.ageCategory,
                    registrant.competitionCategory,
                    registrant.PerformanceCategory
                );

                // Get the shared data that's the same for all performers in this registration
                const sharedData = {
                    'Parent/Teacher Name': registrant.name,
                    'Teacher Name': registrant.teacherName,
                    'Remark': registrant.remark,
                    'Competition Category': registrant.competitionCategory,
                    'Instrument Category': registrant.instrumentCategory,
                    'Age Category': ageCategoryLabel, // ✨ USE MAPPED LABEL
                    'Performance Category': registrant.PerformanceCategory,
                    'YouTube Link': registrant.youtubeLink,
                    'Duplicate Link Tag': duplicateTags[registrant.youtubeLink] || '',
                    'Video Duration': formatDuration(registrant.videoDuration),
                    'Repertoire PDF': registrant.pdfRepertoireS3Link,
                    'Birth Certificate': registrant.birthCertS3Link,
                    'Payment Proof': registrant.paymentProofS3Link,
                    'Exam Certificate': registrant.examCertificateS3Link,
                    'Profile Photo': registrant.profilePhotoS3Link,
                    'Registration Date': registrant.createdAt ? new Date(registrant.createdAt.seconds * 1000).toLocaleString('en-GB') : '',
                    'Payment Status': registrant.paymentStatus,
                };

                // Check if the registration is for an Ensemble
                if ((registrant.PerformanceCategory || '').trim().toLowerCase() === 'ensemble') {
                    const combinedNames = registrant.performers
                        .map(p => p.fullName || `${p.firstName} ${p.lastName}`)
                        .join(' & ');
                    const combinedEmails = registrant.performers.map(p => p.email).join(', ');
                    const combinedDOBs = registrant.performers.map(p => p.dob).join(', ');
                    const combinedPhones = registrant.performers.map(p => p.phoneNumber).join(', ');

                    dataForSheet.push({
                        'No.': originalRowNumber,
                        'Name': combinedNames,
                        'Email': registrant.performers[0]?.email,
                        'Date of Birth': combinedDOBs,
                        'Phone Number': combinedPhones,
                        'Country': registrant.performers[0]?.country,
                        'City': registrant.performers[0]?.city,
                        ...sharedData
                    });
                } else {
                    // Solo - separate row for each performer
                    registrant.performers.forEach(performer => {
                        dataForSheet.push({
                            'No.': originalRowNumber,
                            'Name': performer.fullName ? `${performer.fullName}` : `${performer.firstName} ${performer.lastName}`,
                            'Email': performer.email,
                            'Date of Birth': performer.dob,
                            'Phone Number': performer.phoneNumber,
                            'Country': performer.country,
                            'City': performer.city,
                            ...sharedData
                        });
                    });
                }
            });

            // --- 4. POPULATE THE CURRENT WORKSHEET ---
            if (dataForSheet.length > 0) {
                const headers = Object.keys(dataForSheet[0]);
                worksheet.getRow(1).values = headers;
                worksheet.getRow(1).font = { bold: true };

                const formatLinkCell = (cell) => {
                    const link = cell.value;
                    if (typeof link !== 'string' || !link) return;

                    let hyperlinkUrl = '';

                    if (link.startsWith('s3://')) {
                        hyperlinkUrl = constructS3PublicUrl(getS3KeyFromUri(link));
                    } else if (link.startsWith('http')) {
                        hyperlinkUrl = link;
                    }

                    if (hyperlinkUrl) {
                        cell.value = {
                            text: 'View Link',
                            hyperlink: hyperlinkUrl,
                        };
                        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
                    }
                };

                const linkColumns = [
                    'Repertoire PDF',
                    'Birth Certificate',
                    'Exam Certificate',
                    'Profile Photo',
                    'Payment Proof',
                ];

                dataForSheet.forEach(item => {
                    const row = worksheet.addRow(Object.values(item));

                    linkColumns.forEach(columnName => {
                        const columnIndex = headers.indexOf(columnName) + 1;
                        if (columnIndex > 0) {
                            formatLinkCell(row.getCell(columnIndex));
                        }
                    });
                });

                worksheet.columns.forEach(column => {
                    let maxLength = 0;
                    column.eachCell({ includeEmpty: true }, cell => {
                        let columnLength = cell.value ? cell.value.toString().length : 10;
                        if (columnLength > maxLength) {
                            maxLength = columnLength;
                        }
                    });
                    column.width = maxLength < 10 ? 10 : maxLength + 2;
                });
            }
        }

        // --- 5. GENERATE AND DOWNLOAD THE FINAL WORKBOOK ---
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            FileSaver.saveAs(blob, "All_Registrants_by_Category_2025.xlsx");
        });
    };

    const handleExportByCategoryWithAgeTabs = (allData, competitionCategory) => {
        if (!allData || allData.length === 0) {
            message.warn("No data available to export.");
            return;
        }

        if (!competitionCategory) {
            message.error("Please specify a competition category.");
            return;
        }

        // Filter data by competition category
        const categoryData = allData.filter(
            registrant => registrant.competitionCategory === competitionCategory
        );

        if (categoryData.length === 0) {
            message.warn(`No registrants found for ${competitionCategory}.`);
            return;
        }

        message.info(`Preparing Excel export for ${competitionCategory}...`);

        // --- GROUP BY AGE CATEGORY ---
        const groupedByAge = categoryData.reduce((acc, registrant) => {
            // Get age category label
            const ageCategoryLabel = getAgeCategoryLabel(
                registrant.ageCategory,
                registrant.competitionCategory,
                registrant.PerformanceCategory
            );

            // Use "Ensemble" as a separate category if needed
            const categoryKey = registrant.PerformanceCategory === 'Ensemble'
                ? 'Ensemble'
                : ageCategoryLabel;

            if (!acc[categoryKey]) {
                acc[categoryKey] = [];
            }
            acc[categoryKey].push(registrant);
            return acc;
        }, {});

        // --- Duplicate detection logic ---
        const linkCounts = categoryData.reduce((acc, registrant) => {
            const link = registrant.youtubeLink;
            if (link) {
                acc[link] = (acc[link] || 0) + 1;
            }
            return acc;
        }, {});

        const duplicateTags = {};
        let duplicateCounter = 1;
        for (const link in linkCounts) {
            if (linkCounts[link] > 1) {
                duplicateTags[link] = `duplicate${duplicateCounter}`;
                duplicateCounter++;
            }
        }

        const workbook = new ExcelJS.Workbook();

        // Sort age categories (optional: custom sort order)
        const sortedAgeCategories = Object.keys(groupedByAge).sort((a, b) => {
            // Put Ensemble at the end
            if (a === 'Ensemble') return 1;
            if (b === 'Ensemble') return -1;
            return a.localeCompare(b);
        });

        // --- CREATE A SHEET FOR EACH AGE CATEGORY ---
        sortedAgeCategories.forEach(ageCategory => {
            const ageCategoryData = groupedByAge[ageCategory];

            // Sheet name (max 31 characters)
            const sheetName = ageCategory.length > 30
                ? ageCategory.substring(0, 30)
                : ageCategory;

            const worksheet = workbook.addWorksheet(sheetName);

            // --- PROCESS DATA FOR THIS AGE CATEGORY ---
            const dataForSheet = [];

            ageCategoryData.forEach((registrant, index) => {
                // Get age category label
                const ageCategoryLabel = getAgeCategoryLabel(
                    registrant.ageCategory,
                    registrant.competitionCategory,
                    registrant.PerformanceCategory
                );

                // Shared data for all performers
                const sharedData = {
                    'Parent/Teacher Name': registrant.name || '-',
                    'Teacher Name': registrant.teacherName || '-',
                    'Remark': registrant.remark || '-',
                    'Competition Category': registrant.competitionCategory,
                    'Instrument Category': registrant.instrumentCategory,
                    'Age Category': ageCategoryLabel,
                    'Performance Category': registrant.PerformanceCategory,
                    'YouTube Link': registrant.youtubeLink || '-',
                    'Duplicate Link Tag': duplicateTags[registrant.youtubeLink] || '',
                    'Video Duration': formatDuration(registrant.videoDuration),
                    'Repertoire PDF': registrant.pdfRepertoireS3Link || '-',
                    'Birth Certificate': registrant.birthCertS3Link || '-',
                    'Payment Proof': registrant.paymentProofS3Link || '-',
                    'Exam Certificate': registrant.examCertificateS3Link || '-',
                    'Profile Photo': registrant.profilePhotoS3Link || '-',
                    'Registration Date': registrant.createdAt
                        ? new Date(registrant.createdAt.seconds * 1000).toLocaleString('en-GB')
                        : '-',
                    'Payment Status': registrant.paymentStatus || 'PENDING',
                };

                // Check if Ensemble
                if ((registrant.PerformanceCategory || '').trim().toLowerCase() === 'ensemble') {
                    const combinedNames = registrant.performers
                        .map(p => p.fullName || `${p.firstName} ${p.lastName}`)
                        .join(' & ');
                    const combinedEmails = registrant.performers.map(p => p.email).join(', ');
                    const combinedDOBs = registrant.performers.map(p => p.dob).join(', ');
                    const combinedPhones = registrant.performers.map(p => p.phoneNumber).join(', ');

                    dataForSheet.push({
                        'No.': index + 1,
                        'Name': combinedNames,
                        'Email': registrant.performers[0]?.email || '-',
                        'Date of Birth': combinedDOBs,
                        'Phone Number': combinedPhones,
                        'Country': registrant.performers[0]?.country || '-',
                        'City': registrant.performers[0]?.city || '-',
                        ...sharedData
                    });
                } else {
                    // Solo - separate row for each performer (though usually just 1)
                    registrant.performers.forEach(performer => {
                        dataForSheet.push({
                            'No.': index + 1,
                            'Name': performer.fullName
                                ? performer.fullName
                                : `${performer.firstName} ${performer.lastName}`,
                            'Email': performer.email || '-',
                            'Date of Birth': performer.dob || '-',
                            'Phone Number': performer.phoneNumber || '-',
                            'Country': performer.country || '-',
                            'City': performer.city || '-',
                            ...sharedData
                        });
                    });
                }
            });

            // --- POPULATE WORKSHEET ---
            if (dataForSheet.length > 0) {
                const headers = Object.keys(dataForSheet[0]);

                // Add header row
                worksheet.getRow(1).values = headers;
                worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
                worksheet.getRow(1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4472C4' }
                };
                worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

                // Format link cells
                const formatLinkCell = (cell) => {
                    const link = cell.value;
                    if (typeof link !== 'string' || !link || link === '-') return;

                    let hyperlinkUrl = '';

                    if (link.startsWith('s3://')) {
                        hyperlinkUrl = constructS3PublicUrl(getS3KeyFromUri(link));
                    } else if (link.startsWith('http')) {
                        hyperlinkUrl = link;
                    }

                    if (hyperlinkUrl) {
                        cell.value = {
                            text: 'View Link',
                            hyperlink: hyperlinkUrl,
                        };
                        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
                    }
                };

                const linkColumns = [
                    'Repertoire PDF',
                    'Birth Certificate',
                    'Exam Certificate',
                    'Profile Photo',
                    'Payment Proof',
                    'YouTube Link'
                ];

                // Add data rows
                dataForSheet.forEach(item => {
                    const row = worksheet.addRow(Object.values(item));

                    // Format link columns
                    linkColumns.forEach(columnName => {
                        const columnIndex = headers.indexOf(columnName) + 1;
                        if (columnIndex > 0) {
                            formatLinkCell(row.getCell(columnIndex));
                        }
                    });

                    // Alternate row colors for better readability
                    if (row.number % 2 === 0) {
                        row.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFF2F2F2' }
                        };
                    }
                });

                // Auto-fit columns
                worksheet.columns.forEach(column => {
                    let maxLength = 0;
                    column.eachCell({ includeEmpty: true }, cell => {
                        let columnLength = cell.value ? cell.value.toString().length : 10;
                        if (columnLength > maxLength) {
                            maxLength = columnLength;
                        }
                    });
                    column.width = maxLength < 10 ? 10 : Math.min(maxLength + 2, 50);
                });

                // Freeze first row
                worksheet.views = [
                    { state: 'frozen', xSplit: 0, ySplit: 1 }
                ];
            }
        });

        // --- GENERATE AND DOWNLOAD ---
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const fileName = `${competitionCategory}_Registrants_by_Age_2025.xlsx`;
            FileSaver.saveAs(blob, fileName);
            message.success(`Excel file for ${competitionCategory} exported successfully!`);
        }).catch(error => {
            console.error('Export error:', error);
            message.error('Failed to export Excel file');
        });
    };

    const handleDownloadPDF = async (record) => {
        message.loading({ content: 'Preparing your download...', key: 'download' });
        try {
            const filesToDownload = [];
            const performerName = record.performers[0]?.fullName ? `${record.performers[0]?.fullName}` : `${record.performers[0]?.firstName}_${record.performers[0]?.lastName}`;

            const addFilesFromField = (fieldContent, baseName) => {
                if (typeof fieldContent === 'string' && fieldContent) {
                    const links = fieldContent.split('&').map(link => link.trim());
                    links.forEach((link, index) => {
                        const fileName = links.length > 1 ? `${baseName}_${index + 1}.pdf` : `${baseName}.pdf`;
                        if (link.startsWith('http') || link.startsWith('s3://')) {
                            // Just send the raw link to the backend
                            filesToDownload.push({
                                link: link,
                                zipPath: fileName
                            });
                        }
                    });
                }
            };

            // Process all link fields
            addFilesFromField(record.birthCertS3Link, 'birth_certificate');
            addFilesFromField(record.examCertificateS3Link, 'exam_certificate');
            addFilesFromField(record.paymentProofS3Link, 'payment_proof');
            addFilesFromField(record.pdfRepertoireS3Link, 'repertoire');
            addFilesFromField(record.profilePhotoS3Link, 'profile_photo');

            // TODO: might need to fix this on BE
            const modifiedFiles = filesToDownload.map(file => {
                return {
                    ...file, // Keep other properties like zipPath
                    // Replace '.pdf' with an empty string, but only if it's at the end of the string ($)
                    link: file.link.replace(/\.pdf$/, "")
                };
            });

            if (modifiedFiles.length === 0) {
                message.warn({ content: "No documents are linked for this registrant.", key: 'download' });
                return;
            }

            // Call the backend API (no change here)
            const response = await apis.aws.downloadFiles(modifiedFiles, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/zip' });
            saveAs(blob, `${performerName}_documents.zip`);
            message.success({ content: 'Download started!', key: 'download' });

        } catch (error) {
            console.error('Download failed:', error);
            message.error({ content: 'Failed to download documents.', key: 'download' });
        }
    };

    const handleDownloadAll = async () => {
        if (!allData || allData.length === 0) {
            message.warn("No registrant data available to download.");
            return;
        }

        setIsDownloadingAll(true);

        try {
            const chunkSize = 50; // Set the batch size
            const numChunks = Math.ceil(allData.length / chunkSize);

            // 1. Loop through the data in chunks of 100
            for (let i = 530; i < allData.length; i += chunkSize) {
                const chunk = allData.slice(i, i + chunkSize);
                const chunkNumber = (i / chunkSize) + 1;

                message.loading({
                    content: `Preparing batch ${chunkNumber} of ${numChunks}... (${chunk.length} registrants)`,
                    key: 'downloadAll',
                    duration: 0
                });

                const payload = [];

                // 2. Prepare the payload for just the current chunk
                chunk.forEach(registrant => {
                    const category = registrant.competitionCategory || 'Uncategorized';
                    const performerName = registrant.performers[0]?.fullName ? `${registrant.performers[0]?.fullName}`.replace(/ /g, '_') : `${registrant.performers[0]?.firstName}_${registrant.performers[0]?.lastName}`.replace(/ /g, '_');
                    const registrantFolder = `${category}/${performerName}_${registrant.id.slice(0, 6)}`;

                    const addFile = (s3Link, fileName) => {
                        if (s3Link) {
                            payload.push({
                                s3Key: stripS3Prefix(s3Link),
                                zipPath: `${registrantFolder}/${fileName}`
                            });
                        }
                    };

                    addFile(registrant.birthCertS3Link, 'birth_certificate.pdf');
                    addFile(registrant.examCertificateS3Link, 'exam_certificate.pdf');
                    addFile(registrant.paymentProofS3Link, 'payment_proof.pdf');
                    addFile(registrant.pdfRepertoireS3Link, 'repertoire.pdf');
                    addFile(registrant.profilePhotoS3Link, 'profile_photo.jpg');
                });

                // 3. Call the backend API for the current chunk
                const response = await apis.aws.downloadAllFiles(payload, {
                    responseType: 'blob'
                });

                // 4. Trigger the download for this chunk's zip file
                const blob = new Blob([response.data], { type: 'application/zip' });
                saveAs(blob, `registrants_documents_part_${chunkNumber}.zip`);
            }

            message.success({ content: 'All document batches have been downloaded!', key: 'downloadAll' });

        } catch (error) {
            console.error('Download all failed:', error);
            message.error({ content: 'Failed to download documents. Please check the console.', key: 'downloadAll' });
        } finally {
            setIsDownloadingAll(false);
        }
    };

    const updatePaymentStatus = async (record) => {
        try {
            const docRef = doc(db, 'Registrants2025', record.id);
            await updateDoc(docRef, {
                paymentStatus: "PAID"
            });
            message.success({ content: `Successfully updated registrant(s)!`, key: 'updateStatus' });
            fetchUserData(1)
        } catch (error) {
            console.error("Error updating document(s): ", error);
        }
    };

    // --- NEW HANDLER FUNCTIONS FOR THE MODAL ---
    const showEditModal = (record) => {
        setEditingRecord(record);
        // Populate the form state from the selected record
        setEditFormState({
            firstName: record.performers[0]?.firstName || '',
            lastName: record.performers[0]?.lastName || '',
            fullName: record.performers[0]?.fullName || '',
            youtubeLink: record.youtubeLink || '',
            email: record.performers[0]?.email || '',
            ageCategory: record.ageCategory || '',

        });
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditingRecord(null);
        setEditFormState({ firstName: '', lastName: '', youtubeLink: '', email: '' });
    };

    // A single handler for all input changes in the modal
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        if (!editingRecord) return;

        setIsSaving(true);
        try {
            // Firestore requires us to update the entire 'performers' array.
            // 1. Make a copy of the original performers array.
            const updatedPerformers = [...editingRecord.performers];

            // 2. Update the name for the first performer in our copy.
            updatedPerformers[0] = {
                ...updatedPerformers[0],
                firstName: editFormState.firstName,
                lastName: editFormState.lastName,
                fullName: editFormState.fullName,
                email: editFormState.email,

            };

            // 3. Prepare the final payload with the new youtubeLink and the modified performers array.
            const updatePayload = {
                youtubeLink: editFormState.youtubeLink,
                ageCategory: editFormState.ageCategory,
                performers: updatedPerformers,
            };

            const docRef = doc(db, 'Registrants2025', editingRecord.id);
            await updateDoc(docRef, updatePayload);

            message.success('Registrant data updated successfully!');
            fetchUserData(page);
            handleEditCancel();

        } catch (error) {
            console.error("Error updating registrant data: ", error);
            message.error('Failed to update data.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleViewVideo = async (record) => {
        let urlToPlay = null;

        try {
            const s3Link = record.videoPerformanceS3Link;
            const response = await apis.aws.getPublicVideoLinkAws({ s3Link });
            urlToPlay = response.data.url;
        } catch (error) {
            console.error("Failed to load video", error);
            message.error("Could not load video file.");
            return;
        }

        if (urlToPlay) {
            setVideoUrl(urlToPlay);
            setIsVideoModalOpen(true);
        }
    };


    const columns = getRegistrants2025Columns(getAgeCategoryLabel, handleDownloadPDF, updatePaymentStatus, showEditModal, handleDeleteRegistrant, deletingId, handleViewVideo);

    const handleRecheckDurations = async () => {
        setIsUpdating(true);
        setProgress(0);
        setUpdateMessage("Fetching all registrant data...");

        try {
            const querySnapshot = await getDocs(collection(db, "Registrants2025"));
            const allDocs = querySnapshot.docs;
            const total = allDocs.length;

            if (total === 0) {
                message.info("No registrants to update.");
                setIsUpdating(false);
                return;
            }

            let batch = writeBatch(db);
            let operationsCount = 0;
            let updatedCount = 0;

            for (let i = 0; i < total; i++) {
                const docSnap = allDocs[i];
                const registrant = docSnap.data();

                const performerName = registrant.performers[0]?.firstName || registrant.name;
                setUpdateMessage(`(${i + 1}/${total}) Checking video for ${performerName}...`);

                const videoId = extractVideoId(registrant.youtubeLink);
                if (videoId) {
                    // This now calls the real, promisified function from your utils
                    const newDuration = await fetchYouTubeDuration(videoId);

                    if (newDuration !== null && newDuration !== registrant.videoDuration) {
                        batch.update(docSnap.ref, { videoDuration: newDuration });
                        operationsCount++;
                        updatedCount++;
                    }
                }

                setProgress(Math.round(((i + 1) / total) * 100));

                if (operationsCount === 499) {
                    await batch.commit();
                    batch = writeBatch(db);
                    operationsCount = 0;
                }
            }

            if (operationsCount > 0) {
                await batch.commit();
            }

            message.success(`Process complete! ${updatedCount} video durations were updated.`);
            fetchUserData(page);

        } catch (error) {
            console.error("Failed during bulk update:", error);
            message.error("An error occurred during the update process.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUploadRegistrantAPCS2025 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        message.loading({ content: 'Reading and processing your file...', key: 'upload' });

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = event.target.result;
                const workbook = xlsx.read(data, { type: "array", cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // --- CORRECTED PARSING LOGIC ---
                // 1. Parse the entire sheet into an array of arrays to get full control.
                const rowsAsArrays = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
                // const rowsAsArrays = rowsAsArraysRaw.slice(1);

                // 3. Manually extract the header row (row 2) and the data rows (row 4 onwards).
                const headers = rowsAsArrays[0];
                const dataRows = rowsAsArrays.slice(1); // Skips banner, header, and example row.

                // 4. Manually convert the arrays into an array of objects using the headers.
                const json = dataRows.map(rowArray => {
                    const rowObject = {};
                    headers.forEach((header, index) => {
                        if (header) { // Only add data for columns that have a header
                            rowObject[header] = rowArray[index];
                        }
                    });
                    return rowObject;
                });
                // --- END OF CORRECTED PARSING LOGIC ---


                if (json.length === 0) {
                    message.error({ content: 'The uploaded file has no data to process.', key: 'upload' });
                    setIsUploading(false);
                    return;
                }

                message.loading({ content: `Processing ${json.length} records...`, key: 'upload' });

                // Helper to parse strings like "1,5 mins" or "3 mins" into seconds
                const parseDurationToSeconds = (durationStr) => {
                    if (typeof durationStr !== 'string' || !durationStr) return 0;
                    try {
                        const cleanedStr = durationStr.replace(',', '.').replace('mins', '').trim();
                        const minutes = parseFloat(cleanedStr);
                        return Math.round(minutes * 60);
                    } catch (e) {
                        return 0;
                    }
                };

                // Helper to split a full name into first and last names
                const splitFullName = (fullName) => {
                    if (typeof fullName !== 'string' || !fullName) return { firstName: '', lastName: '' };
                    const parts = fullName.trim().split(' ');
                    const lastName = parts.pop();
                    const firstName = parts.join(' ');
                    return { firstName, lastName };
                };

                const registrantsToUpload = json.map(row => {
                    const fullNameString = row['Full Name'] || '';
                    const dobString = String(row['Date of Birth'] || '');
                    const phoneString = String(row['Phone Number'] || '');

                    // 1. Split each field by its respective separator into an array
                    const individualNames = fullNameString.split('&').map(name => name.trim());
                    const individualDobs = dobString.split('&').map(dob => dob.trim());
                    const individualPhones = phoneString.split('/').map(phone => phone.trim());

                    const performers = individualNames.map((name, index) => {
                        const { firstName, lastName } = splitFullName(name);

                        // This creates a complete performer object for each person
                        return {
                            firstName: firstName,
                            lastName: lastName,
                            fullName: name,
                            email: row['Email'] || '',
                            dob: parseDateString(individualDobs[index] || individualDobs[0] || ''),
                            gender: row['Gender'] || '',
                            nationality: row['Nationality'] || 'Indonesia',
                            country: row['Country'] || 'Indonesia',
                            province: row['Province'] || '',
                            city: row['City'] || '',
                            zipCode: String(row['Zip Code'] || ''),
                            addressLine: row['addressline'] || '',
                            phoneNumber: individualPhones[index] || individualPhones[0] || '',
                            countryCode: row['Country Code'] || '+62',
                        };
                    });

                    return {
                        // Top-level Info (assuming these might not be in the sheet)
                        name: row['Parent/Guardian Name'] || '',
                        userType: row['User Type'] || 'Teacher',
                        teacherName: row['Teacher Name'] || '',

                        // Competition Details from the sheet
                        competitionCategory: row['Competition Category'] || 'Piano', // Example default
                        instrumentCategory: row['Instrument Category'] || '',
                        ageCategory: (row['Age Category'] || ''),
                        PerformanceCategory: row['Performance Category'] || 'Solo',

                        // Links from the file
                        youtubeLink: row['YouTube Link'] || '',
                        pdfRepertoireS3Link: row['Repertoire'] || '',
                        profilePhotoS3Link: row['Photo'] || '', // Assuming a 'Photo' column might exist
                        birthCertS3Link: row['Birth Certificate'] || '',
                        examCertificateS3Link: row['Recommendation Letter / Exam Certificate'] || '',

                        // Nested Performer Data
                        performers: performers,

                        // Default / Generated Values
                        totalPerformer: performers.length, // Correctly count the number of performers
                        agreement: true,
                        paymentStatus: 'PAID',
                        videoDuration: parseDurationToSeconds(row['Max Duration']),
                        createdAt: serverTimestamp(),
                    };
                });

                console.log("registrantsToUpload", registrantsToUpload)

                // Batch Upload Step
                message.loading({ content: `Uploading ${registrantsToUpload.length} documents to Firestore...`, key: 'upload' });
                const batchSize = 499;
                for (let i = 0; i < registrantsToUpload.length; i += batchSize) {
                    const batch = writeBatch(db);
                    const chunk = registrantsToUpload.slice(i, i + batchSize);

                    // chunk.forEach((registrantData) => {
                    //     const newDocRef = doc(collection(db, "Registrants2025Dummy"));
                    //     batch.set(newDocRef, registrantData);
                    // });

                    await batch.commit();
                }

                // --- NEW: INTELLIGENTLY GROUP EMAILS BEFORE SENDING ---
                const groupedEmails = json.reduce((acc, row) => {
                    const email = (row['Email'] || '').toLowerCase().trim();
                    const name = (row['Full Name'] || '').trim();

                    // Skip rows that don't have an email or a name
                    if (!email || !name) return acc;

                    if (!acc[email]) {
                        // If we see this email for the first time, create a new entry
                        acc[email] = {
                            email: row['Email'],
                            teacherName: row['Teacher Name'] || 'Participant',
                            // Use the original 'Full Name' which can be "John Doe" or "John Doe & Jane Smith"
                            names: [name]
                        };
                    } else {
                        // If this email already exists, just add the new name to its list
                        acc[email].names.push(name);
                    }
                    return acc;
                }, {});

                console.log("groupedEmails", groupedEmails)

                // Convert the grouped object back into an array for the API
                const emailPayload = Object.values(groupedEmails);

                // --- Send the consolidated email payload to the backend ---
                if (emailPayload.length > 0) {
                    await apis.email.sendEmailNotifyBulkUpdateRegistrant(emailPayload);
                }

                message.success({ content: `Successfully uploaded ${registrantsToUpload.length} registrants!`, key: 'upload' });
                fetchUserData(1);

            } catch (error) {
                console.error("Error processing or uploading file:", error);
                message.error({ content: 'An error occurred. Please check the console for details.', key: 'upload' });
            } finally {
                setIsUploading(false);
                e.target.value = null;
            }
        };
        reader.readAsArrayBuffer(file);
    };

    console.log("registrantDatas", registrantDatas)

    return (
        <Content
            style={{
                margin: '0 16px',
            }}
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <div>
                    Total Data: {totalDocs}
                </div>
                <Input.Search
                    placeholder="Search by performer name..."
                    onSearch={value => { setPage(1); setSearchTerm(value); }}
                    style={{ width: 300 }}
                    allowClear
                />
                <Input.Search
                    placeholder="Search by teacher name..."
                    onSearch={value => { setPage(1); setSearchTeacherName(value); }}
                    style={{ width: 300 }}
                    allowClear
                />
                <Select
                    placeholder="Filter by Competition"
                    style={{ width: 200 }}
                    onChange={handleCompetitionFilterChange}
                    options={competitionCategoryOptions}
                    allowClear
                />
                <Select
                    placeholder="Filter by Age Category"
                    style={{ width: 200 }}
                    onChange={handleAgeFilterChange}
                    options={ageCategoryOptions}
                    allowClear
                />
                <Select
                    placeholder="Filter by Performance"
                    style={{ width: 200 }}
                    onChange={handlePerformanceFilterChange}
                    options={performanceCategoryOptions}
                    allowClear
                />
            </Space>
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    overflow: 'auto',
                }}
            >
                <Table columns={columns} dataSource={registrantDatas} onChange={handlePageChange} pagination={false} />
                <Pagination
                    className='mt-16'
                    current={page}
                    pageSize={pageSize}
                    total={totalDocs} // Total number of items
                    onChange={handlePageChange}
                    showSizeChanger={false}
                // onShowSizeChange={onShowSizeChange}
                />
            </div>
            <form style={{ background: "white" }}>
                <label htmlFor="Save Registrand to DB" >Upload Registrant To Database </label>
                <input
                    type="file"
                    name="upload"
                    id="upload"
                    onChange={handleUploadRegistrantAPCS2025}
                    style={{ marginLeft: 4 }}
                />
            </form>
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Button type="primary" onClick={handleExportToExcel}>Export to excel</Button>
                <Button type="primary" onClick={() => handleExportByCategoryWithAgeTabs(allData, "Harp")}>Export to excel Age</Button>

                {/* <Button
                    style={{ marginLeft: 8 }}
                    onClick={handleRecheckDurations}
                    loading={isUpdating} // Use the new loading state
                >
                    Re-check All YouTube Durations
                </Button> */}

                {/* <Button
                    style={{ marginLeft: 8 }}
                    onClick={handleDownloadAll}
                    loading={isDownloadingAll}
                >
                    Download All Documents
                </Button> */}

                <Button style={{ marginLeft: 8 }} onClick={handleShowStatsModal}>
                    View Teacher Stats
                </Button>
            </div>
            <Modal
                title="Updating Video Durations"
                open={isUpdating}
                footer={null}
                closable={false}
            >
                <p>{updateMessage}</p>
                <Progress percent={progress} />
                <p style={{ marginTop: '10px', textAlign: 'center' }}>Please keep this tab open until the process is complete.</p>
            </Modal>
            <Modal
                title="Edit Registrant Details"
                open={isEditModalVisible}
                onOk={handleEditSave}
                onCancel={handleEditCancel}
                confirmLoading={isSaving}
                okText="Save"
            >
                {editingRecord && (
                    <Form layout="vertical">
                        <Form.Item label="Performer First Name">
                            <Input
                                name="firstName"
                                value={editFormState.firstName}
                                onChange={handleEditFormChange}
                            />
                        </Form.Item>
                        <Form.Item label="Performer Last Name">
                            <Input
                                name="lastName"
                                value={editFormState.lastName}
                                onChange={handleEditFormChange}
                            />
                        </Form.Item>
                        <Form.Item label="Performer Last Name">
                            <Input
                                name="fullName"
                                value={editFormState.fullName}
                                onChange={handleEditFormChange}
                            />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input
                                name="email"
                                value={editFormState.email}
                                onChange={handleEditFormChange}
                            />
                        </Form.Item>
                        <Form.Item label="YouTube Link">
                            <Input
                                name="youtubeLink"
                                value={editFormState.youtubeLink}
                                onChange={handleEditFormChange}
                                placeholder="https://youtube.com/..."
                            />
                        </Form.Item>
                        <Form.Item label="Age Category">
                            <Input
                                name="ageCategory"
                                value={editFormState.ageCategory}
                                onChange={handleEditFormChange}
                                placeholder="Young"
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
            <Modal
                title="Teacher Registration Summary"
                open={isStatsModalVisible}
                onCancel={() => setIsStatsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsStatsModalVisible(false)}>
                        Close
                    </Button>,
                    <Button key="export" type="primary" onClick={handleExportTeacherStats}>
                        Export to Excel
                    </Button>
                ]}
                width={800}
            >
                <Table
                    dataSource={teacherStats}
                    columns={statsColumns}
                    pagination={{ pageSize: 10 }}
                />
            </Modal>
            <Modal
                title="Performance Preview"
                open={isVideoModalOpen}
                onCancel={() => {
                    setIsVideoModalOpen(false);
                    setVideoUrl(null); // Stop video when closed
                }}
                footer={[
                    <Button key="close" onClick={() => setIsVideoModalOpen(false)}>Close</Button>
                ]}
                width={800}
                destroyOnClose
            >
                {videoUrl && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            preload="metadata" // Only download the "Index" first, not the video
                            style={{ width: '100%', maxHeight: '450px' }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </Modal>
        </Content>
    )
}

export default RegistrantDashboard;