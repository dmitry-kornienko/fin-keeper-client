import { Card, Divider, Form, Space } from "antd";
import { CustomInput } from "../custom-input";
import { CustomButton } from "../custom-button";
import { ErrorMessage } from "../error-message";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { useUpdateUserInfoMutation } from "../../app/services/auth";
import { selectUser, updateUserInfo } from "../../features/auth/authSlice";
import { Paths } from "../../paths";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import styles from "./index.module.css";

export const UserEditInfoForm: React.FC = () => {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const [errorInfo, setErrorInfo] = useState("");
    const [infoBtnLoading, setInfoBtnLoading] = useState(false);
    const [editUserInfo] = useUpdateUserInfoMutation();
    const dispatch = useAppDispatch();

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
            navigate(Paths.weekReport);
        } catch (error) {
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
                    <CustomInput name="name" type="text" placeholder="Имя" />
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
    );
};
