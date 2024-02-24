import React from "react";
import { useGetAllReportsQuery } from "../../app/services/report";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Report } from "../../types";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import styles from "./index.module.css";
import { getDate } from "../../utils/get-date-format";
import { addSpacesToNumberWithDecimal } from "../../utils/add-spaces-to-number";

export const WeekReports = () => {
    const { data, isLoading } = useGetAllReportsQuery();

    const navigate = useNavigate();

    const columns: ColumnsType<Report> = [
        {
            title: "Номер отчета",
            dataIndex: "realizationreport_id",
            key: "realizationreport_id"
        },
        {
            title: "Дата начала",
            dataIndex: "date_from",
            render: (_, record) => getDate(record.date_from),
            key: "date_from",
        },
        {
            title: "Дата конца",
            dataIndex: "date_to",
            render: (_, record) => getDate(record.date_to),
            key: "date_to",
        },
        {
            title: "Продажа",
            dataIndex: "sale",
            render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.sale)}</div>,
            key: "sale",
        },
        {
            title: "Комиссия",
            dataIndex: "comission_sum",
            render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.comission_sum)}</div>,
            key: "comission_sum",
        },
        {
            title: "Логистика",
            dataIndex: "delivery_sum",
            render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.delivery_sum)}</div>,
            key: "delivery_sum",
        },
        {
            title: "Хранение",
            dataIndex: "storage",
            render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.storage)}</div>,
            key: "storage",
        },
        {
            title: "Штрафы",
            dataIndex: "penalty",
            render: (_, record) => <div>{addSpacesToNumberWithDecimal(record.penalty)}</div>,
            key: "penalty",
        },
        {
            title: "К оплате",
            dataIndex: "total_payment",
            render: (_, record) => (
                <div>{addSpacesToNumberWithDecimal(record.total_payment)}</div>
            ),
            key: "total_payment",
        },
    ]
    
    return (
        <Table
            loading={isLoading}
            dataSource={data}
            size="small"
            columns={columns}
            className={ styles.reportsTable }
            rowKey={(report) => report._id}
                onRow={(report) => {
                    return {
                        onClick: () =>
                            navigate(`${Paths.report}/${report._id}`),
                    };
                }}
        />
    );
};
