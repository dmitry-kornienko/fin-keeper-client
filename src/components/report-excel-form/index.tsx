import { Button, DatePicker, Divider, Form, Space, Upload } from "antd";
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { CustomButton } from "../custom-button";
import { CustomInput } from "../custom-input";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { useState } from "react";
import { ErrorMessage } from "../error-message";
import { UploadOutlined } from "@ant-design/icons";
import { getDataForExcelAddingReport } from "../../utils/get-data-for-excel-adding-report";

export interface ExcelDataRow {
    [key: string]: string;
}

interface AddReportData {
    realizationreport_id: number,
    dateFrom: string,
    dateTo: string,
}

export const ReportExcelForm = () => {

    const [error, setError] = useState("");
    const [excelData, setExcelData] = useState<Array<ExcelDataRow> | null>(null);

    const handleUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const dataArr = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
            if (dataArr.length > 0) {
              const headers = dataArr[0];
              const formattedData = dataArr.slice(1).map(row => {
                const obj: ExcelDataRow = {};
                headers.forEach((header, index) => {
                  obj[header] = row[index];
                });
                return obj;
              });
              setExcelData(formattedData);
            }
          }
        };
        reader.readAsArrayBuffer(file);
        return false
      };

    const handleAddReportThroughExcel = (data: AddReportData) => {
        try {
            const formattedData = {
                dateFrom: dayjs(data.dateFrom).format('YYYY-MM-DD'),
                dateTo: dayjs(data.dateTo).format('YYYY-MM-DD'),
            };
            if (excelData) {
                const detArr = getDataForExcelAddingReport({ arr: excelData, dateFrom: formattedData.dateFrom, dateTo: formattedData.dateTo, realizationreport_id: data.realizationreport_id })
                console.log(data.realizationreport_id);
                console.log(formattedData);
                console.log(detArr)
            }
            
        } catch (error) {
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError("Неизвестная ошибка");
            }
        }
    }

    return (
        <Form name="excel-report-form" onFinish={ handleAddReportThroughExcel } >
            <CustomInput name="realizationreport_id" placeholder="Номер отчета" />
            <Space>
                <Form.Item
                    name="dateFrom"
                    rules={[{ required: true, message: 'Обязательное поле' }]}
                >
                    <DatePicker placeholder="Дата начала" />
                </Form.Item>
                <Form.Item
                    name="dateTo"
                    rules={[{ required: true, message: 'Обязательное поле' }]}
                >
                    <DatePicker placeholder="Дата конца" />
                </Form.Item>
            </Space>
            <Form.Item
                name="detalization"
                rules={[{ required: true, message: 'Выберите детализацию' }]}
            >
                <Upload
                    beforeUpload={handleUpload}
                    accept=".xlsx, .xls"
                    maxCount={1}
                >
                    <Button icon={ <UploadOutlined /> }>
                        Выберите файл
                    </Button>
                </Upload>
            </Form.Item>
            <Divider />
                <CustomButton htmlType="submit">
                    Добавить
                </CustomButton>
            <ErrorMessage message={ error } />
        </Form>
    )
}
