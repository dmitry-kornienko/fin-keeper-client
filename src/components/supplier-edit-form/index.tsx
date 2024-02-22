import { Card, Form, Select, Space } from "antd";
import React, { useState } from "react";
import { CustomInput } from "../custom-input";
import { CustomButton } from "../custom-button";
import { ErrorMessage } from "../error-message";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useSelector } from "react-redux";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { selectSuppliers } from "../../features/suppliers/suppliersSlice";
import styles from "./index.module.css";
import { useUpdateSupplierInfoMutation } from "../../app/services/supplier";

export const SupplierEditForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const suppliers = useSelector(selectSuppliers);
    const currentSupplier = suppliers?.suppliers?.find(
        (i) => i.is_active === true
    );

    const [updateSupplierInfo] = useUpdateSupplierInfoMutation();

    const handleEditSupplier = async (data: {
        _id: string;
        name: string;
        tax_rate: number;
        tax_from: string;
        token_stat: string;
    }) => {
        try {
            setLoading(true);

            if (currentSupplier) {
                await updateSupplierInfo({
                    _id: currentSupplier._id,
                    name: data.name,
                    tax_rate: data.tax_rate,
                    tax_from: data.tax_from,
                    token_stat: data.token_stat,
                });
            }

            setLoading(false);
            navigate(Paths.weekReport);
            window.location.reload();
        } catch (error) {
            setLoading(false);

            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError("Неизвестная ошибка");
            }
        }
    };

    return (
        <Card title="Изменение данных поставщика" className={styles.card}>
            {currentSupplier && (
                <Form
                    name="edit-supplier"
                    onFinish={handleEditSupplier}
                    initialValues={currentSupplier}
                >
                    <label>Название</label>
                    <CustomInput
                        name="name"
                        type="text"
                        placeholder="Название"
                    />
                    <Form.Item label="Налоговая ставка" name="tax_rate">
                        <Select
                            placeholder="6%"
                            style={{ width: 120 }}
                            options={[
                                { value: 0, label: "0%" },
                                { value: 1, label: "1%" },
                                { value: 2, label: "2%" },
                                { value: 3, label: "3%" },
                                { value: 4, label: "4%" },
                                { value: 5, label: "5%" },
                                { value: 6, label: "6%" },
                                { value: 7, label: "7%" },
                                { value: 8, label: "8%" },
                                { value: 9, label: "9%" },
                                { value: 10, label: "10%" },
                                { value: 11, label: "11%" },
                                { value: 12, label: "12%" },
                                { value: 13, label: "13%" },
                                { value: 14, label: "14%" },
                                { value: 15, label: "15%" },
                                { value: 16, label: "16%" },
                                { value: 17, label: "17%" },
                                { value: 18, label: "18%" },
                                { value: 19, label: "19%" },
                                { value: 20, label: "20%" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="tax_from" label="Налоговая база">
                        <Select
                            placeholder="Продажа"
                            style={{ width: 120 }}
                            options={[
                                { value: "ppvz_for_pay", label: "Продажа" },
                                { value: "retail_amount", label: "Оборот" },
                                { value: "var3", label: "Вариант 3" },
                                { value: "var4", label: "Вариант 4" },
                            ]}
                        />
                    </Form.Item>
                    <CustomInput
                        name="token_stat"
                        type="text"
                        placeholder="Токен статистики WB"
                    />
                    <Space>
                        <ErrorMessage message={error} />
                        <CustomButton htmlType="submit" loading={loading}>
                            Сохранить
                        </CustomButton>
                        <CustomButton
                            danger
                            onClick={() => navigate(Paths.weekReport)}
                        >
                            Отмена
                        </CustomButton>
                    </Space>
                </Form>
            )}
        </Card>
    );
};
