import { Card, Form, Space } from "antd";
import { CustomButton } from "../custom-button";
import { ErrorMessage } from "../error-message";
import { PasswordInput } from "../password-input";
import { useState } from "react";
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

    const handleEditPassword = async (data: {
        currentPassword: string;
        password: string;
    }) => {
        try {
            setPasswordBtnLoading(true);
            if (user) {
                await editUserPassword({
                    _id: user._id,
                    currentPassword: data.currentPassword,
                    newPassword: data.password,
                }).unwrap();
            }
            setPasswordBtnLoading(false);
        } catch (error) {
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setErrorPassword(error.data.message);
            } else {
                setErrorPassword("Неизвестная ошибка");
            }

            setPasswordBtnLoading(false);
        }
    };

    return (
        <Card title="Изменение пароля" className={styles.card}>
            {user && (
                <Form name="edit-user-password" onFinish={handleEditPassword}>
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
        </Card>
    );
};
