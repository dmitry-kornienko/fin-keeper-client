import { Card, Divider, Form, FormInstance, Space, message } from "antd";
import { CustomButton } from "../custom-button";
import { ErrorMessage } from "../error-message";
import { PasswordInput } from "../password-input";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateUserPasswordMutation } from "../../app/services/auth";
import { selectUser } from "../../features/auth/authSlice";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import styles from "./index.module.css";

export const UserEditPasswordForm: React.FC = () => {
    const user = useSelector(selectUser);
    const [errorPassword, setErrorPassword] = useState("");
    const [passwordBtnLoading, setPasswordBtnLoading] = useState(false);
    const [editUserPassword] = useUpdateUserPasswordMutation();
    const formRef = useRef<FormInstance>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: "success",
            content: "Пароль изменен",
        });
    };

    const errorMessage = () => {
        messageApi.open({
            type: "error",
            content: "Не удалось изменить пароль",
        });
    };

    const handleEditPassword = async (data: {
        currentPassword: string;
        password: string;
    }) => {
        try {
            setErrorPassword("");
            setPasswordBtnLoading(true);
            if (user) {
                await editUserPassword({
                    _id: user._id,
                    currentPassword: data.currentPassword,
                    newPassword: data.password,
                }).unwrap();
            }
            setPasswordBtnLoading(false);
            success();
            formRef.current?.resetFields();
        } catch (error) {
            const maybeError = isErrorWithMessage(error);
            errorMessage();

            if (maybeError) {
                setErrorPassword(error.data.message);
            } else {
                setErrorPassword("Неизвестная ошибка");
            }

            setPasswordBtnLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Card title="Изменение пароля" className={styles.card}>
                {user && (
                    <Form
                        name="edit-user-password"
                        onFinish={handleEditPassword}
                        ref={formRef}
                    >
                        <PasswordInput
                            name="currentPassword"
                            placeholder="Текущий пароль"
                        />
                        <PasswordInput
                            name="password"
                            placeholder="Новый пароль"
                            hasFeedback
                        />
                        <PasswordInput
                            name="confirmPassword"
                            dependencies={["newPassword"]}
                            placeholder="Повторите пароль"
                            hasFeedback
                        />
                        <Space>
                            <CustomButton
                                htmlType="submit"
                                loading={passwordBtnLoading}
                            >
                                Сохранить
                            </CustomButton>
                            <ErrorMessage message={errorPassword} />
                        </Space>
                    </Form>
                )}
                <Divider />
            </Card>
        </>
    );
};
