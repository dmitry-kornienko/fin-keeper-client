import { Card, Divider, Form, Space } from "antd";
import { CustomInput } from "../custom-input";
import { CustomButton } from "../custom-button";
import { ErrorMessage } from "../error-message";
import { PasswordInput } from "../password-input";
import { Layout } from "../layout";
import { User } from "../../types";
import styles from "./index.module.css";

type Props = {
    onFinishInfo: (values: { name: string; email: string }) => void;
    onFinishPassword: (values: {
        currentPassword: string;
        newPassword: string;
    }) => void;
    btnText: string;
    error?: string;
    infoBtnLoading?: boolean;
    passwordBtnLoading?: boolean;
    user: Omit<User, "token">;
};

export const UserEditForm: React.FC<Props> = ({
    onFinishInfo,
    onFinishPassword,
    btnText,
    error,
    infoBtnLoading,
    passwordBtnLoading,
    user,
}) => {
    return (
        <Layout>
            <Card title="Изменение данных пользователя" className={styles.card}>
                <Form
                    name="edit-user-form"
                    onFinish={onFinishInfo}
                    initialValues={user}
                >
                    <label>Имя пользователя</label>
                    <CustomInput name="name" type="text" placeholder="Имя" />
                    <label>Email</label>
                    <CustomInput
                        name="email"
                        type="email"
                        placeholder="Email"
                    />
                    <Space>
                        <ErrorMessage message={error} />
                        <CustomButton
                            htmlType="submit"
                            loading={infoBtnLoading}
                        >
                            {btnText}
                        </CustomButton>
                    </Space>
                </Form>
                <Divider />
                <Form name="edit-user-password" onFinish={onFinishPassword}>
                    <PasswordInput
                        name="currentPassword"
                        placeholder="Текущий пароль"
                    />
                    <PasswordInput
                        name="newPassword"
                        placeholder="Новый пароль"
                    />
                    <PasswordInput
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        placeholder="Повторите пароль"
                    />
                    <Space>
                        <ErrorMessage message={error} />
                        <CustomButton
                            htmlType="submit"
                            loading={passwordBtnLoading}
                        >
                            {btnText}
                        </CustomButton>
                    </Space>
                </Form>
            </Card>
        </Layout>
    );
};
