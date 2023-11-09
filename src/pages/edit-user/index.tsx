import { useState } from "react";
import { Layout } from "antd";
import { UserEditForm } from "../../components/user-edit-form";
import { useNavigate } from "react-router-dom";
import { useUpdateUserInfoMutation } from "../../app/services/auth";
import { useSelector } from "react-redux";
import { selectUser, updateUserInfo } from "../../features/auth/authSlice";
import { Paths } from "../../paths";
import { useAppDispatch } from "../../app/hooks";
import { isErrorWithMessage } from "../../utils/is-error-with-message";

export const EditUser = () => {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [infoBtnLoading, setInfoBtnLoading] = useState(false);
    const [passwordBtnLoading, setPasswordBtnLoading] = useState(false);
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
                setError(error.data.message);
            } else {
                setError("Неизвестная ошибка");
            }

            setInfoBtnLoading(false);
        }
    };

    const handleEditPassword = async () => {
        try {
            setPasswordBtnLoading(true);
            console.log("update password");
        } catch (error) {
            const maybeError = isErrorWithMessage(error);

            if (maybeError) {
                setError(error.data.message);
            } else {
                setError("Неизвестная ошибка");
            }

            setPasswordBtnLoading(false);
        }
    };

    return (
        <Layout>
            {user && (
                <UserEditForm
                    btnText="Сохранить"
                    onFinishInfo={handleEditInfo}
                    onFinishPassword={handleEditPassword}
                    infoBtnLoading={infoBtnLoading}
                    passwordBtnLoading={passwordBtnLoading}
                    user={user}
                    error={error}
                />
            )}
        </Layout>
    );
};
