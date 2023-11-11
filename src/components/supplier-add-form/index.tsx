import { Card, Form, Select, Space, Switch, Typography } from "antd";
import React, { useState } from "react";
import { CustomInput } from "../custom-input";
import { CustomButton } from "../custom-button";
import { ErrorMessage } from "../error-message";
import styles from "./index.module.css"
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { useAddSupplierMutation } from "../../app/services/supplier";
import { Supplier } from "../../types";
import { isErrorWithMessage } from "../../utils/is-error-with-message";

export const SupplierAddForm = () => {

    const [loading, setLoading] = useState(false);
    const [isVisibleTokenInput, setIsVisibleToken] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [addSupplier] = useAddSupplierMutation();

    const handleChangeRateSelect = (value: string) => {
        console.log(`selected ${value}`);
    };
    const handleChangeFromSelect = (value: string) => {
        console.log(`selected ${value}`);
    };
    const onChangeSwitch = (checked: boolean) => {
        setIsVisibleToken(!isVisibleTokenInput);
    };


    const handleAddSupplier = async (data: Supplier) => {
        try {
            setLoading(true);

            if (user) {
                const dataForNewSupplier = {
                    name: data.name,
                    tax_rate: data.tax_rate,
                    tax_from: data.tax_from,
                    token_stat: data.token_stat,
                }
                console.log(dataForNewSupplier)
                await addSupplier({ userId: user._id, ...dataForNewSupplier })
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);

            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError("Неизвестная ошибка");
            }
        }
    }

    return (
        <Card title="Добавление поставщика" className={ styles.card }>
            <Form name="add-supplier" onFinish={ handleAddSupplier }>
                <label>Название</label>
                <CustomInput name="name" type="text" placeholder="Название" />
                    <Form.Item label="Налоговая ставка" name="tax_rate">
                        <Select
                            placeholder="6%"
                            style={{ width: 120 }}
                            onChange={handleChangeRateSelect}
                            options={[
                                { value: 0, label: '0%' },
                                { value: 1, label: '1%' },
                                { value: 2, label: '2%' },
                                { value: 3, label: '3%' },
                                { value: 4, label: '4%' },
                                { value: 5, label: '5%' },
                                { value: 6, label: '6%' },
                                { value: 7, label: '7%' },
                                { value: 8, label: '8%' },
                                { value: 9, label: '9%' },
                                { value: 10, label: '10%' },
                                { value: 11, label: '11%' },
                                { value: 12, label: '12%' },
                                { value: 13, label: '13%' },
                                { value: 14, label: '14%' },
                                { value: 15, label: '15%' },
                                { value: 16, label: '16%' },
                                { value: 17, label: '17%' },
                                { value: 18, label: '18%' },
                                { value: 19, label: '19%' },
                                { value: 20, label: '20%' },
                            ]}
                        />
                    </Form.Item>
                <Form.Item name="tax_from" label="Налоговая база">
                    <Select 
                        placeholder="Продажа"
                        style={{ width: 120 }}
                        onChange={handleChangeFromSelect}
                        options={[
                            { value: 'ppvz_for_pay', label: 'Продажа' },
                            { value: 'retail_amount', label: 'Оборот' },
                            { value: 'var3', label: 'Вариант 3' },
                            { value: 'var4', label: 'Вариант 4' },
                        ]}
                    />
                </Form.Item>
                <div style={{ marginBottom: "20px" }}>
                    <Space align="baseline">
                        <Typography>Получать данные по API?</Typography>
                        <Switch defaultChecked={false} onChange={onChangeSwitch} style={{ marginBottom: "5px" }} />
                    </Space>
                {
                    isVisibleTokenInput ? (
                            <CustomInput
                                name="token_stat"
                                type="text"
                                placeholder="Токен статистики WB"
                            />
                    ) : null
                }
                </div>
                <Space>
                    <ErrorMessage message={error} />
                    <CustomButton htmlType="submit" loading={loading}>
                        Сохранить
                    </CustomButton>
                    <CustomButton danger onClick={ () => navigate(Paths.weekReport) }>
                        Отмена
                    </CustomButton>
                </Space>
            </Form>
        </Card>
    );
};
