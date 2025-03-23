import { Button, Layout, Pagination, Table, theme } from 'antd';
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import React from 'react';
import { RegistrantsColumns } from '../../constant/RegistrantsColumn';
import usePaginatedRegistrants from '../../hooks/useFetchRegistrantsData';

const { Content } = Layout;

const RegistrantDashboard = () => {
    const pageSize = 10

    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    const { registrantDatas, page, setPage, totalDocs, allData, loading } = usePaginatedRegistrants(pageSize, "Registrant2025");

    const handlePageChange = (pagination, filters, sorter, extra) => {
        setPage(pagination);
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

    const handleExportToExcel = (data) => {
        const workbook = new ExcelJS.Workbook();

        data.forEach(dayData => {
            dayData.data.forEach((StageData, stageIndex) => {
                StageData.sessionGroup.forEach((eachSession, sessionIndex) => {
                    const worksheet = workbook.addWorksheet(`Day ${dayData.day} - Stage ${stageIndex + 1} - Session ${sessionIndex + 1}`);

                    const eachRecord = eachSession.records;

                    if (eachRecord.length > 0) {
                        const headers = Object.keys(eachRecord[0]);
                        worksheet.addRow(headers);

                        eachRecord.forEach(item => {
                            const values = headers.map(header => item[header]);
                            worksheet.addRow(values);
                        });
                    } else {
                        worksheet.addRow(["No data for this Rundown."]);
                    }
                })
            });
        });

        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, "registrant.xlsx");
        });
    }

    return (
        <Content
            style={{
                margin: '0 16px',
            }}
        >
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Table columns={RegistrantsColumns} dataSource={registrantDatas} onChange={handlePageChange} pagination={false} />
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
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Button type="primary" onClick={handleExportToExcel}>Export to excel</Button>
            </div>
        </Content>
    )
}

export default RegistrantDashboard;