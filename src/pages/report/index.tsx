import { useNavigate, useParams } from "react-router-dom";
import {
    useEditAdditionalParametersReportMutation,
    useEditCostPriceMutation,
    useGetReportQuery,
    useRemoveReportMutation,
} from "../../app/services/report";
import { Loader } from "../../components/loader";
import { Layout } from "../../components/layout";
import { Descriptions, Divider, Form, Input, Modal, Space, Table, message } from "antd";
import {
    LeftOutlined,
    EditOutlined,
    DeleteOutlined,
    SettingOutlined,
    FormOutlined,
} from "@ant-design/icons";
import { CustomButton } from "../../components/custom-button";
import { useState } from "react";
import { ErrorMessage } from "../../components/error-message";
import { ColumnsType } from "antd/es/table";
import { addSpacesToNumberWithDecimal } from "../../utils/add-spaces-to-number";
import { getDate } from "../../utils/get-date-format";
import { CustomInput } from "../../components/custom-input";
import { Paths } from "../../paths";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { Report as ReportType } from "../../types";
import styles from "./index.module.css";

export const Report = () => {
    const params = useParams<{ id: string }>();
    const {
        data,
        isLoading,
        refetch: refetchGetReport,
    } = useGetReportQuery(params.id || "");
    const [removeReport] = useRemoveReportMutation();
    const [
        editAdditionalParameters,
        { isLoading: isEditAdditionalParametersLoading },
    ] = useEditAdditionalParametersReportMutation();
    const [editCostPrice, { isLoading: isEditCostPriceLoading }] =
        useEditCostPriceMutation();

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditCostPriceModalOpen, setIsEditCostPriceModalOpen] =
        useState(false);
    const [error, setError] = useState("");

    const showModal = () => {
        setIsModalOpen(true);
    };
    const showEditModal = () => {
        setIsEditModalOpen(true);
    };
    const showEditCostPriceModal = () => {
        setIsEditCostPriceModalOpen(true);
    };

    const hideModal = () => {
        setIsModalOpen(false);
    };
    const hideEditModal = () => {
        setIsEditModalOpen(false);
    };
    const hideEditCostPriceModal = () => {
        setIsEditCostPriceModalOpen(false);
    };

    const getCostPriceOfReport = (report: ReportType): number => {
        const sum = report.composition.reduce(
            (sum, el) => sum + el.cost_price * el.sale_count,
            0
        );
        return sum;
    };

    const tableColumns: ColumnsType<{
        article: string;
        cost_price: number; // Себестоимость единицы
        retail_amount: number; // Продано ВБ
        sale_count: number; // Кол-во продаж
        return_count: number; // Кол-во возвратов
        sale_sum: number; // Сумма продаж (ppvz_for_pay)
        return_sum: number; // Сумма возвратов
        delivery: number;
    }> = [
        {
            title: "Артикул",
            dataIndex: "article",
            key: "article",
        },
        {
            title: (
                <Space>
                    <span>Себестоимость ед.</span>
                    <FormOutlined
                        onClick={showEditCostPriceModal}
                        className={styles.editCostPriceBtn}
                    />
                </Space>
            ),
            dataIndex: "cost_price",
            render: (_, record) => (
                <Space className={styles.iconTooltipContainer}>
                    <span>{record.cost_price}</span>
                    <EditOutlined
                        onClick={showEditCostPriceModal}
                        className={styles.iconTooltip}
                    />
                </Space>
            ),
            key: "cost_price,",
        },
        {
            title: "Продажи, шт",
            dataIndex: "sale_count",
            key: "sale_count",
        },
        {
            title: "Возвраты, шт",
            dataIndex: "return_count",
            key: "return_count",
        },
        {
            title: "Продажи, руб",
            dataIndex: "sale_sum",
            render: (_, record) =>
                addSpacesToNumberWithDecimal(record.sale_sum),
            key: "sale_sum",
        },
        {
            title: "Логистика",
            dataIndex: "delivery",
            render: (_, record) =>
                addSpacesToNumberWithDecimal(record.delivery),
            key: "delivery",
        },
        {
            title: "Налог",
            render: (_, record) =>
                addSpacesToNumberWithDecimal(record.retail_amount * 0.07),
        },
        {
            title: "Доход",
            render: (_, record) =>
                addSpacesToNumberWithDecimal(
                    record.sale_sum -
                        record.return_sum -
                        record.cost_price * record.sale_count -
                        record.delivery -
                        record.retail_amount * 0.07
                ),
        },
        {
            title: "Доход на единицу",
            render: (_, record) =>
                addSpacesToNumberWithDecimal(
                    (record.sale_sum -
                        record.return_sum -
                        record.cost_price * record.sale_count -
                        record.delivery -
                        record.retail_amount * 0.07) /
                        record.sale_count
                ),
        },
    ];

    const [messageApi, contextHolder] = message.useMessage();

    const successEditCostPrice = () => {
      messageApi.open({
        type: 'success',
        content: 'Себестоимость обнавлена',
      });
    };
  
    const errorEditCostPrice = () => {
      messageApi.open({
        type: 'error',
        content: 'Ошибка зименения себестоимости',
      });
    };
    
    const successEditAdditionalParams = () => {
      messageApi.open({
        type: 'success',
        content: 'Новые значения сохранены',
      });
    };
  
    const errorEditAdditionalParams = () => {
      messageApi.open({
        type: 'error',
        content: 'Не удалось изменить параметры',
      });
    };

    const handleDeleteReport = async () => {
        try {
            if (data) {
                await removeReport(data._id);
                hideModal();
                navigate(Paths.weekReport);
            }
        } catch (error) {
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError("Неизвестная ошибка");
            }
        }
    };

    const handleEditAdditionalParametrs = async (parametrs: {
        storage: number;
        taking_payment: number;
        other_deductions: number;
    }) => {
        try {
            if (data) {
                await editAdditionalParameters({
                    id: data._id,
                    storage: Number(parametrs.storage),
                    other_deductions: Number(parametrs.other_deductions),
                    taking_payment: Number(parametrs.taking_payment),
                }).unwrap();
                await refetchGetReport();
                successEditAdditionalParams();
                hideEditModal();
            }
        } catch {
            errorEditAdditionalParams();
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError("Неизвестная ошибка");
            }
        }
    };

    type DataForEditCostPrice = {
        composition: {
            article: string;
            cost_price: number;
        }[];
    };

    const handleEditCostPrice = async (parameters: DataForEditCostPrice) => {
        try {
            if (data) {
                const arrForDB = parameters.composition.map((i) => ({
                    article: i.article,
                    cost_price: Number(i.cost_price),
                }));
                await editCostPrice({ id: data._id, composition: arrForDB });
                refetchGetReport();
                successEditCostPrice();
                hideEditCostPriceModal();
            }
        } catch (error) {
            errorEditCostPrice();
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError("Неизвестная ошибка");
            }
        }
    };

    return (
        <Layout>
            {contextHolder}
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Descriptions title="Детализация отчета" size="small">
                        <Descriptions.Item label="Номер отчета">
                            {data?.realizationreport_id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Дата начала">
                            {data ? `${getDate(data.date_from)}` : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Дата конца">
                            {data ? `${getDate(data.date_to)}` : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Продажа">
                            {data
                                ? `${addSpacesToNumberWithDecimal(data.sale)}`
                                : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Комиссия">
                            {data
                                ? `${addSpacesToNumberWithDecimal(
                                      data.comission_sum
                                  )}`
                                : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Логистика">
                            {data
                                ? `${addSpacesToNumberWithDecimal(
                                      data.delivery_sum
                                  )}`
                                : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Налог">
                            {data
                                ? `${addSpacesToNumberWithDecimal(
                                      data.tax_sum
                                  )}`
                                : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Себестоимость товара">
                            {data
                                ? addSpacesToNumberWithDecimal(
                                      getCostPriceOfReport(data)
                                  )
                                : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Штрафы">
                            {data?.penalty}
                        </Descriptions.Item>
                        <Descriptions.Item label="Хранение">
                            <Space>
                                {data?.storage}
                                <SettingOutlined
                                    className={styles.editBtn}
                                    onClick={showEditModal}
                                />
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Платная приемка">
                            <Space>
                                {data?.taking_payment}
                                <SettingOutlined
                                    className={styles.editBtn}
                                    onClick={showEditModal}
                                />
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Прочие удержания">
                            <Space>
                                {data?.other_deductions}
                                <SettingOutlined
                                    className={styles.editBtn}
                                    onClick={showEditModal}
                                />
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="К оплате">
                            {data
                                ? `${addSpacesToNumberWithDecimal(
                                      data.ppvz_for_pay -
                                          data.delivery_sum -
                                          data.penalty -
                                          data.additional_payment -
                                          data.storage -
                                          data.taking_payment -
                                          data.other_deductions
                                  )}`
                                : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Доход">
                            {data
                                ? addSpacesToNumberWithDecimal(
                                      data.ppvz_for_pay -
                                          data.delivery_sum -
                                          data.penalty -
                                          data.additional_payment -
                                          data.storage -
                                          data.taking_payment -
                                          data.other_deductions -
                                          getCostPriceOfReport(data) -
                                          data.tax_sum
                                  )
                                : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Рентабельность">
                            {data
                                ? `${(
                                      ((data.ppvz_for_pay -
                                          data.delivery_sum -
                                          data.penalty -
                                          data.additional_payment -
                                          data.storage -
                                          data.taking_payment -
                                          data.other_deductions -
                                          getCostPriceOfReport(data) -
                                          data.tax_sum) /
                                          getCostPriceOfReport(data)) *
                                      100
                                  ).toFixed(2)} %`
                                : ""}
                        </Descriptions.Item>
                    </Descriptions>
                    <Table
                        bordered
                        dataSource={data?.composition}
                        columns={tableColumns}
                        size="small"
                        pagination={false}
                        scroll={{ x: 1000 }}
                    />
                    <Divider orientation="left">Действия</Divider>
                    <Space>
                        <CustomButton
                            type="dashed"
                            icon={<LeftOutlined />}
                            onClick={() => navigate(-1)}
                        >
                            Назад
                        </CustomButton>
                        <CustomButton
                            onClick={showEditModal}
                            shape="round"
                            type="default"
                            icon={<EditOutlined />}
                        >
                            Внести недостающие данные
                        </CustomButton>
                        <CustomButton
                            shape="round"
                            danger
                            onClick={showModal}
                            icon={<DeleteOutlined />}
                        >
                            Удалить
                        </CustomButton>
                    </Space>
                    <ErrorMessage message={error} />
                    <Modal
                        title="Подтвердите удаление"
                        open={isModalOpen}
                        onOk={handleDeleteReport}
                        onCancel={hideModal}
                        okText="Подтвердить"
                        cancelText="Отменить"
                    >
                        Действительно хотите удалить отчет из таблицы?
                    </Modal>
                    <Modal
                        title="Внесение дополнительных данных"
                        open={isEditModalOpen}
                        footer={null}
                        onCancel={hideEditModal}
                    >
                        <Form
                            initialValues={data}
                            onFinish={handleEditAdditionalParametrs}
                        >
                            <label>Хранение</label>
                            <CustomInput
                                name="storage"
                                placeholder="Стоимость хранения"
                            />
                            <label>Приемка</label>
                            <CustomInput
                                name="taking_payment"
                                placeholder="Платная приемка"
                            />
                            <label>Прочее</label>
                            <CustomInput
                                name="other_deductions"
                                placeholder="Прочие удержания"
                            />
                            <Space>
                                <ErrorMessage message={error} />
                                <CustomButton
                                    htmlType="submit"
                                    type="primary"
                                    loading={isEditAdditionalParametersLoading}
                                >
                                    Сохранить
                                </CustomButton>
                                <CustomButton onClick={hideEditModal} danger>
                                    Отмена
                                </CustomButton>
                            </Space>
                        </Form>
                    </Modal>
                    <Modal
                        title="Изменение себестоимости товаров в отчете"
                        open={isEditCostPriceModalOpen}
                        footer={null}
                        onCancel={hideEditCostPriceModal}
                    >
                        <Form
                            initialValues={data}
                            onFinish={handleEditCostPrice}
                            size="small"
                        >
                            <Form.List name="composition">
                                {(fields) => (
                                    <>
                                        {fields.map(
                                            ({ key, name, ...restField }) => {
                                                const articleValue =
                                                    data?.composition[name] &&
                                                    data?.composition[name]
                                                        .article;
                                                return (
                                                    <Space
                                                        key={key}
                                                        style={{
                                                            display: "flex",
                                                            marginBottom: 8,
                                                        }}
                                                        align="baseline"
                                                    >
                                                        <label>
                                                            {articleValue}
                                                        </label>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[
                                                                name,
                                                                "cost_price",
                                                            ]}
                                                            rules={[
                                                                {
                                                                    required:
                                                                        true,
                                                                    message:
                                                                        "Обязательное поле",
                                                                },
                                                            ]}
                                                        >
                                                            <Input
                                                                placeholder="Себестоимость"
                                                                type="number"
                                                            />
                                                        </Form.Item>
                                                    </Space>
                                                );
                                            }
                                        )}
                                    </>
                                )}
                            </Form.List>
                            <Space>
                                <ErrorMessage message={error} />
                                <CustomButton
                                    htmlType="submit"
                                    type="primary"
                                    loading={isEditCostPriceLoading}
                                >
                                    Сохранить
                                </CustomButton>
                                <CustomButton
                                    onClick={hideEditCostPriceModal}
                                    danger
                                >
                                    Отмена
                                </CustomButton>
                            </Space>
                        </Form>
                    </Modal>
                </>
            )}
        </Layout>
    );
};
