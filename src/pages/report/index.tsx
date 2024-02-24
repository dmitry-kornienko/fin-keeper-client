import { Link, useNavigate, useParams } from "react-router-dom"
import { useGetReportQuery } from "../../app/services/report"
import { Loader } from "../../components/loader";
import { Layout } from "../../components/layout";
import { Descriptions, Divider, Modal, Space, Table } from "antd";
import { LeftOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CustomButton } from "../../components/custom-button";
import { useState } from "react";
import { ErrorMessage } from "../../components/error-message";
import { ColumnsType } from "antd/es/table";
import { addSpacesToNumberWithDecimal } from "../../utils/add-spaces-to-number";
import { getDate } from "../../utils/get-date-format";
import styles from "./index.module.css";

const tableColumns: ColumnsType<{
    article: string,
    cost_price: number, // Себестоимость единицы
    retail_amount: number, // Продано ВБ
    sale_count: number, // Кол-во продаж
    return_count: number, // Кол-во возвратов
    sale_sum: number, // Сумма продаж (ppvz_for_pay)
    return_sum: number, // Сумма возвратов
    delivery: number,
}> = [
    {
        title: 'Артикул',
        dataIndex: 'article',
        key: 'article',
    },
    {
        title: 'Себестоимость ед.',
        dataIndex: 'cost_price',
        key: 'cost_price',
    },
    {
        title: 'Продажи, шт',
        dataIndex: 'sale_count',
        key: 'sale_count',
    },
    {
        title: 'Возвраты, шт',
        dataIndex: 'return_count',
        key: 'return_count',
    },
    {
        title: 'Продажи, руб',
        dataIndex: 'sale_sum',
        render: (_, record) => addSpacesToNumberWithDecimal(record.sale_sum),
        key: 'sale_sum',
    },
    {
        title: 'Логистика',
        dataIndex: 'delivery',
        render: (_, record) => addSpacesToNumberWithDecimal(record.delivery),
        key: 'delivery',
    },
    {
        title: 'Налог',
        render: (_, record) => addSpacesToNumberWithDecimal(record.retail_amount * 0.07)
    },
    {
        title: 'Доход',
        render: (_, record) => addSpacesToNumberWithDecimal((record.sale_sum - record.return_sum) - (record.cost_price * record.sale_count) - record.delivery - (record.retail_amount * 0.07))
    },
    {
        title: 'Доход на единицу',
        render: (_, record) => addSpacesToNumberWithDecimal(((record.sale_sum - record.return_sum) - (record.cost_price * record.sale_count) - record.delivery - (record.retail_amount * 0.07)) / record.sale_count)
    },
]

export const Report = () => {
    const params = useParams<{id: string}>();
    const { data, isLoading } = useGetReportQuery(params.id || "");

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    const showModal = () => {
        setIsModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    }

    const handleDeleteReport = async () => {
        hideModal();
        try {

        } catch (error) {

        }
    }

    return (
        <Layout>
            {isLoading ? <Loader /> :
            <>
                <Descriptions className={ styles.report } title="Детализация отчета" size="small">
                    <Descriptions.Item label="Номер отчета">
                        {data?.realizationreport_id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Дата начала">
                        { data ? `${getDate(data.date_from)}` : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Дата конца">
                        { data ? `${getDate(data.date_to)}` : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Продажа">
                        { data ? `${addSpacesToNumberWithDecimal(data.sale)}` : "" }
                    </Descriptions.Item>
                    <Descriptions.Item label="Комиссия">
                        { data ? `${addSpacesToNumberWithDecimal(data.comission_sum)}` : "" }
                    </Descriptions.Item>
                    <Descriptions.Item label="Логистика">
                        { data ? `${addSpacesToNumberWithDecimal(data.delivery_sum)}` : "" }
                    </Descriptions.Item>
                    <Descriptions.Item label="Хранение">
                        {data?.storage}
                    </Descriptions.Item>
                    <Descriptions.Item label="Штрафы">
                        {data?.penalty}
                    </Descriptions.Item>
                    <Descriptions.Item label="Платная приемка">
                        {data?.taking_payment}
                    </Descriptions.Item>
                    <Descriptions.Item label="Прочие удержания">
                        {data?.other_deductions}
                    </Descriptions.Item>
                    <Descriptions.Item label="К оплате">
                        { data ? `${addSpacesToNumberWithDecimal(data.total_payment)}` : "" }
                    </Descriptions.Item>
                    <Descriptions.Item label="Себестоимость товара">
                        В разработке
                    </Descriptions.Item>
                    <Descriptions.Item label="Доход">
                        В разработке
                    </Descriptions.Item>
                    <Descriptions.Item label="Рентабельность">
                        В разработке
                    </Descriptions.Item>
                </Descriptions>
                <Table
                    bordered
                    dataSource={ data?.composition }
                    columns={ tableColumns }
                    size="small"
                    pagination={ false }
                    scroll={{ x: 1000 }}
                />
                <Divider orientation='left'>Действия</Divider>
                        <Space>
                            <CustomButton type='dashed' icon={ <LeftOutlined /> } onClick={ () => navigate(-1)}>
                                Назад
                            </CustomButton>
                            <Link to={`/report/edit/${data?._id}`}>
                                <CustomButton
                                    shape='round'
                                    type='default'
                                    icon={ <EditOutlined />}
                                >
                                    Внести недостающие данные
                                </CustomButton>
                            </Link>
                            <CustomButton
                                shape='round'
                                danger
                                onClick={ showModal }
                                icon={ <DeleteOutlined /> }
                            >
                                Удалить
                            </CustomButton>
                        </Space> 
                        <ErrorMessage message={ error } />
            <Modal
                title='Подтвердите удаление'
                open={ isModalOpen }
                onOk={ handleDeleteReport }
                onCancel={ hideModal }
                okText='Подтвердить'
                cancelText='Отменить'
            >
                Действительно хотите удалить отчет из таблицы?    
            </Modal>          
            </>   
            }
        </Layout>
    )
}
