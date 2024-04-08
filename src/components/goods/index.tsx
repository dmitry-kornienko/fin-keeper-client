import {
    useGetAllGoodsQuery,
    useUpdateAllGoodsMutation,
} from "../../app/services/good";
import { Form, Input, Modal, Space, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { Good } from "../../types";
import { FormOutlined } from "@ant-design/icons";
import { useState } from "react";
import { CustomButton } from "../custom-button";
import { ErrorMessage } from "../error-message";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import styles from "./index.module.css";

type DataForEditCostPrice = {
    goods: {
        _id: string;
        article: string;
        cost_price: number;
    }[];
};

export const Goods = () => {
    const { data, isLoading, refetch } = useGetAllGoodsQuery();
    const [updateAllGoods, { isLoading: isLoadingEditCostPrice }] =
        useUpdateAllGoodsMutation();

    const [isEditCostPriceModalOpen, setIsEditCostPriceModalOpen] =
        useState(false);
    const [error, setError] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
      messageApi.open({
        type: 'success',
        content: 'Себестоимость товаров обнавлена',
      });
    };
  
    const errorReq = () => {
      messageApi.open({
        type: 'error',
        content: 'Не удалось изменить себестоимость',
      });
    };

    const showEditCostPriceModal = () => {
        setIsEditCostPriceModalOpen(true);
    };

    const hideEditCostPriceModal = () => {
        setIsEditCostPriceModalOpen(false);
    };

    const handleEditCostPrice = async (dataForm: DataForEditCostPrice) => {
        try {
            const arrForDB = dataForm.goods.map((i) => ({
                id: i._id,
                article: i.article,
                cost_price: Number(i.cost_price),
            }));

            await updateAllGoods(arrForDB);
            refetch();
            hideEditCostPriceModal();
            success();
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

    const columns: ColumnsType<Good> = [
        {
            title: "N",
            render: (_, __, index) => <span>{index + 1}</span>,
            width: "35px",
        },
        {
            title: "Артикул",
            dataIndex: "article",
            width: "200px",
            key: "article",
        },
        {
            title: (
                <Space>
                    <span>Себестоимость</span>
                    <FormOutlined
                        onClick={showEditCostPriceModal}
                        className={styles.editCostPriceBtn}
                    />
                </Space>
            ),
            dataIndex: "cost_price",
            key: "cost_price",
        },
    ];

    return (
        <>
            {contextHolder}
            <Table
                dataSource={data}
                loading={isLoading}
                size="small"
                columns={columns}
                style={{ maxWidth: "450px" }}
            />
            <Modal
                title="Изменение себестоимости товаров"
                open={isEditCostPriceModalOpen}
                footer={null}
                onCancel={hideEditCostPriceModal}
            >
                <Form
                    initialValues={{ goods: data }}
                    onFinish={handleEditCostPrice}
                    size="small"
                >
                    <Form.List name="goods">
                        {(fields) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => {
                                    const articleValue =
                                        data?.[name] && data?.[name].article;

                                    return (
                                        <Space
                                            key={key}
                                            style={{
                                                display: "flex",
                                                marginBottom: 8,
                                            }}
                                            align="baseline"
                                        >
                                            <label>{articleValue}</label>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "cost_price"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Заполните обязательное поле",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Себестоимость" />
                                            </Form.Item>
                                        </Space>
                                    );
                                })}
                            </>
                        )}
                    </Form.List>
                    <Space>
                        <ErrorMessage message={error} />
                        <CustomButton
                            htmlType="submit"
                            type="primary"
                            loading={isLoadingEditCostPrice}
                        >
                            Сохранить
                        </CustomButton>
                        <CustomButton onClick={hideEditCostPriceModal} danger>
                            Отмена
                        </CustomButton>
                    </Space>
                </Form>
            </Modal>
        </>
    );
};
