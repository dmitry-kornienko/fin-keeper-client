import { useState } from "react";
import { Button, DatePicker, Divider, Form, Space, Upload } from "antd";
import dayjs from "dayjs";
import { CustomButton } from "../custom-button";
import { CustomInput } from "../custom-input";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { ErrorMessage } from "../error-message";
import { UploadOutlined } from "@ant-design/icons";
import {
    useAddReportThroughExcelMutation,
    useGetAllReportsQuery,
} from "../../app/services/report";

type Props = {
    hideModal: () => void;
    success: () => void;
    errorReq: () => void;
};

export interface ExcelDataRow {
    [key: string]: string;
}

interface AddReportData {
    realizationreport_id: string;
    dateFrom: string;
    dateTo: string;
}

export const ReportExcelForm: React.FC<Props> = ({
    hideModal,
    errorReq,
    success,
}) => {
    const [addReport, { isLoading }] = useAddReportThroughExcelMutation();
    const { refetch: getAllReports } = useGetAllReportsQuery();

    const [error, setError] = useState("");
    const [excelData, setExcelData] = useState<File | null>(null);

    const handleUpload = (file: File) => {
        setExcelData(file);
        return false;
    };

    const handleAddReportThroughExcel = async (data: AddReportData) => {
        try {
            const formattedData = {
                dateFrom: dayjs(data.dateFrom).format("YYYY-MM-DD"),
                dateTo: dayjs(data.dateTo).format("YYYY-MM-DD"),
            };
            if (excelData) {
                await addReport({
                    dateFrom: formattedData.dateFrom,
                    dateTo: formattedData.dateTo,
                    realizationreport_id: data.realizationreport_id,
                    file: excelData,
                }).unwrap();
                await getAllReports();
                success();
                hideModal();
            }
        } catch (error) {
            errorReq();
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError("Неизвестная ошибка");
            }
        }
    };

    return (
        <Form name="excel-report-form" onFinish={handleAddReportThroughExcel}>
            <CustomInput
                name="realizationreport_id"
                placeholder="Номер отчета"
            />
            <Space>
                <Form.Item
                    name="dateFrom"
                    rules={[{ required: true, message: "Обязательное поле" }]}
                >
                    <DatePicker placeholder="Дата начала" />
                </Form.Item>
                <Form.Item
                    name="dateTo"
                    rules={[{ required: true, message: "Обязательное поле" }]}
                >
                    <DatePicker placeholder="Дата конца" />
                </Form.Item>
            </Space>
            <Form.Item
                name="detalization"
                rules={[{ required: true, message: "Выберите детализацию" }]}
            >
                <Upload
                    beforeUpload={handleUpload}
                    accept=".xlsx, .xls"
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Выберите файл</Button>
                </Upload>
            </Form.Item>
            <Divider />
            <CustomButton htmlType="submit" loading={isLoading}>
                Добавить
            </CustomButton>
            <ErrorMessage message={error} />
        </Form>
    );
};
