import { Card, Divider, Form, Space, message } from "antd";
import { CustomInput } from "../custom-input";
import { CustomButton } from "../custom-button";
import { ErrorMessage } from "../error-message";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import { useUpdateUserInfoMutation } from "../../app/services/auth";
import { selectUser, updateUserInfo } from "../../features/auth/authSlice";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import styles from "./index.module.css";

export const UserEditInfoForm: React.FC = () => {
    const user = useSelector(selectUser);
    const [errorInfo, setErrorInfo] = useState("");
    const [infoBtnLoading, setInfoBtnLoading] = useState(false);
    const [editUserInfo] = useUpdateUserInfoMutation();
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useAppDispatch();

    const success = () => {
        messageApi.open({
            type: "success",
            content: "Информация изменена",
        });
    };

    const errorMessage = () => {
        messageApi.open({
            type: "error",
            content: "Не удалось изменить информацию",
        });
    };

    const handleEditInfo = async (value: { name: string; email: string }) => {
        try {
            setInfoBtnLoading(true);

            if (user) {
                await editUserInfo({
                    _id: user._id,
                    name: value.name,
                    email: value.email,
                }).unwrap();
                dispatch(updateUserInfo(value));
            }

            setInfoBtnLoading(false);
            success();
        } catch (error) {
            errorMessage();
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setErrorInfo(error.data.message);
            } else {
                setErrorInfo("Неизвестная ошибка");
            }

            setInfoBtnLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Card
                title="Изменение информации о пользователе"
                className={styles.card}
            >
                {user && (
                    <Form
                        name="edit-user-form"
                        onFinish={handleEditInfo}
                        initialValues={user}
                    >
                        <label>Имя пользователя</label>
                        <CustomInput
                            name="name"
                            type="text"
                            placeholder="Имя"
                        />
                        <label>Email</label>
                        <CustomInput
                            name="email"
                            type="email"
                            placeholder="Email"
                        />
                        <Space>
                            <ErrorMessage message={errorInfo} />
                            <CustomButton
                                htmlType="submit"
                                loading={infoBtnLoading}
                            >
                                Сохранить
                            </CustomButton>
                        </Space>
                    </Form>
                )}
                <Divider />
            </Card>
        </>
    );
};
