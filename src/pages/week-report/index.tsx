import { Alert, DatePicker, Modal, message } from "antd";
import { CustomButton } from "../../components/custom-button";
import { Layout } from "../../components/layout";
import { WeekReports } from "../../components/week-reports";
import { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import {
    useAddReportMutation,
    useGetAllReportsQuery,
} from "../../app/services/report";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { ErrorMessage } from "../../components/error-message";
import styles from "./index.module.css";
import { ReportExcelForm } from "../../components/report-excel-form";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const { RangePicker } = DatePicker;

export const WeekReportsPage = () => {

    const user = useSelector(selectUser);
    
    const [addReport, { isLoading }] = useAddReportMutation();
    const { refetch: getAllReports } = useGetAllReportsQuery();

    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentDayOfWeek = dayjs().day();

    const disabledDate = (current: Dayjs | null): boolean => {
        const threeMonthsAgo = dayjs().subtract(3, 'month');
        return current ? current.isBefore(threeMonthsAgo, 'day') : false;
      };

    const [dates, setDates] = useState({
        date_from: "",
        date_to: "",
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
                date_from: "",
                date_to: "",
            });

            success();
        } catch (error) {
            errorReq();

            setDates({
                date_from: "",
                date_to: "",
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
                date_from: dateStrings[0],
                date_to: dateStrings[1],
            });
        }
    };

    return (
        <Layout>
            {user?.isActivated ? <>
                {contextHolder}
                <div className={styles.forms} >
                    {
                        currentDayOfWeek !== 1 ? (
                            <div className={styles.formAddReport}>
                                <div className={styles.apiAdding}>
                                    <RangePicker disabledDate={disabledDate} onChange={onChangeDate} />
                                    <CustomButton
                                        onClick={handleAddReport}
                                        type="primary"
                                        loading={isLoading}
                                        disabled={!dates.date_from || !dates.date_to}
                                    >
                                        Добавить отчет
                                    </CustomButton>
                                <ErrorMessage message={error} />
                                </div>
                            </div>
                        ): <Alert message="По понедельникам API WB не работает. Можете загрузить отчет через Excel" type="error" />
                    }
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
            </>
            :
            <div>Профиль не активирован. Для автивации перейдите в <a href="https://t.me/finKeeperInfoBot" target="_blank" rel="noreferrer">телеграм бот</a></div>}
        </Layout>
    );
};
