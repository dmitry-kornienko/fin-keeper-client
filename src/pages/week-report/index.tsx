import { DatePicker, Modal, message } from "antd";
import { CustomButton } from "../../components/custom-button";
import { Layout } from "../../components/layout";
import { WeekReports } from "../../components/week-reports";
import { useState } from "react";
import type { Dayjs } from "dayjs";
import {
    useAddReportMutation,
    useGetAllReportsQuery,
} from "../../app/services/report";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { ErrorMessage } from "../../components/error-message";
import styles from "./index.module.css";
import { ReportExcelForm } from "../../components/report-excel-form";

const { RangePicker } = DatePicker;

export const WeekReportsPage = () => {
    const [addReport, { isLoading }] = useAddReportMutation();
    const { refetch: getAllReports } = useGetAllReportsQuery();

    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [dates, setDates] = useState({
        dateFrom: "",
        dateTo: "",
    });

    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: "success",
            content: "Отчет успешно добавлен",
        });
    };

    const errorReq = () => {
        messageApi.open({
            type: "error",
            content: "Не удалось создать новый отчет",
        });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setIsModalOpen(false);
    };

    const handleAddReport = async () => {
        try {
            setError("");

            await addReport(dates).unwrap();
            await getAllReports();

            setDates({
                dateFrom: "",
                dateTo: "",
            });

            success();
        } catch (error) {
            errorReq();

            setDates({
                dateFrom: "",
                dateTo: "",
            });
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError("Неизвестная ошибка");
            }
        }
    };

    const onChangeDate = (
        dates: null | (Dayjs | null)[],
        dateStrings: string[]
    ) => {
        if (dates) {
            setDates({
                dateFrom: dateStrings[0],
                dateTo: dateStrings[1],
            });
        }
    };
    return (
        <Layout>
            {contextHolder}
            <div className={styles.formAddReport}>
                <div className={styles.apiAdding}>
                    <RangePicker onChange={onChangeDate} />
                    <CustomButton
                        onClick={handleAddReport}
                        type="primary"
                        loading={isLoading}
                        disabled={!dates.dateFrom || !dates.dateTo}
                    >
                        Добавить отчет
                    </CustomButton>
                <ErrorMessage message={error} />
                </div>
                <CustomButton onClick={showModal} type="link">
                    Добавить через Excel
                </CustomButton>
            </div>
            <WeekReports />
            <Modal
                title="Ручное добавление отчета"
                open={isModalOpen}
                footer={null}
                onCancel={hideModal}
            >
                <ReportExcelForm
                    hideModal={hideModal}
                    success={success}
                    errorReq={errorReq}
                />
            </Modal>
        </Layout>
    );
};
