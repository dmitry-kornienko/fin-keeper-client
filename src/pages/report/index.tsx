import { useNavigate, useParams } from "react-router-dom"
import { useEditAdditionalParametersReportMutation, useGetReportQuery, useRemoveReportMutation } from "../../app/services/report"
import { Loader } from "../../components/loader";
import { Layout } from "../../components/layout";
import { Descriptions, Divider, Form, Modal, Space, Table } from "antd";
import { LeftOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { CustomButton } from "../../components/custom-button";
import { useState } from "react";
import { ErrorMessage } from "../../components/error-message";
import { ColumnsType } from "antd/es/table";
import { addSpacesToNumberWithDecimal } from "../../utils/add-spaces-to-number";
import { getDate } from "../../utils/get-date-format";
import { CustomInput } from "../../components/custom-input";
import { Paths } from "../../paths";
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
    const [ removeReport, { isLoading: isRemoveLoading } ] = useRemoveReportMutation();
    const [ editAdditionalParameters ] = useEditAdditionalParametersReportMutation();

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [error, setError] = useState('');

    const showModal = () => {
        setIsModalOpen(true);
    }
    const showEditModal = () => {
        setIsEditModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    }
    const hideEditModal = () => {
        setIsEditModalOpen(false);
    }

    const handleDeleteReport = async () => {
        try {
            if (data) {
                await removeReport(data._id)
                hideModal();
                navigate(Paths.weekReport);
            }
        } catch (error) {

        }
    }

    const handleEditAdditionalParametrs = async (parametrs: { storage: number, taking_payment: number, other_deductions: number }) => {
        try {
            if (data) {
                await editAdditionalParameters({ id: data._id, storage: Number(parametrs.storage), other_deductions: Number(parametrs.other_deductions), taking_payment: Number(parametrs.taking_payment) });
                window.location.reload();
            }
            hideEditModal()
        } catch {

        }
    }

    return (
        <Layout>
            {isLoading ? <Loader /> :
            <>
                <Descriptions title="Детализация отчета" size="small">
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
                    <Descriptions.Item label="Налог">
                        { data ? `${addSpacesToNumberWithDecimal(data.tax_sum)}` : "" }
                    </Descriptions.Item>
                    <Descriptions.Item label="Себестоимость товара">
                        В разработке
                    </Descriptions.Item>
                    <Descriptions.Item label="Штрафы">
                        {data?.penalty}
                    </Descriptions.Item>
                    <Descriptions.Item label="Хранение">
                        <Space>
                            {data?.storage}
                            <SettingOutlined className={ styles.editBtn } onClick={ showEditModal } />
                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Платная приемка">
                        <Space>
                            {data?.taking_payment}
                            <SettingOutlined className={ styles.editBtn } onClick={ showEditModal } />
                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Прочие удержания">
                        <Space>
                            {data?.other_deductions}
                            <SettingOutlined className={ styles.editBtn } onClick={ showEditModal } />
                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="К оплате">
                        {data ? `${addSpacesToNumberWithDecimal(data.ppvz_for_pay - data.delivery_sum - data.penalty - data.additional_payment - data.storage - data.taking_payment - data.other_deductions)}` : ""}
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
                            <CustomButton
                                onClick={ showEditModal }
                                shape='round'
                                type='default'
                                icon={ <EditOutlined />}
                            >
                                Внести недостающие данные
                            </CustomButton>
                            <CustomButton
                                shape='round'
                                danger
                                onClick={ showModal }
                                icon={ <DeleteOutlined /> }
                                loading={ isRemoveLoading }
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
            <Modal
                title='Внесение дополнительных данных'
                open={ isEditModalOpen }
                footer={null}
                onCancel={ hideEditModal }
            >
                <Form initialValues={data} onFinish={ handleEditAdditionalParametrs }>
                    <label>Хранение</label>
                    <CustomInput name="storage" placeholder="Стоимость хранения" />    
                    <label>Приемка</label>
                    <CustomInput name="taking_payment" placeholder="Платная приемка" />    
                    <label>Прочее</label>
                    <CustomInput name="other_deductions" placeholder="Прочие удержания" />
                    <Space>
                        <ErrorMessage message={error} />
                        <CustomButton
                            htmlType="submit"
                            type="primary"
                            // loading={infoBtnLoading}
                        >
                            Сохранить
                        </CustomButton>
                        <CustomButton onClick={ hideEditModal } danger>
                            Отмена
                        </CustomButton>
                    </Space>
                </Form>  
            </Modal>          
            </>   
            }
        </Layout>
    )
}
