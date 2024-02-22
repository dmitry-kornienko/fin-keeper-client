import { Card, Form, Row, Space, Typography } from "antd";
import { Layout } from "../../components/layout";
import { CustomInput } from "../../components/custom-input";
import { PasswordInput } from "../../components/password-input";
import { CustomButton } from "../../components/custom-button";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useState } from "react";
import { useLoginMutation, UserData } from "../../app/services/auth";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { ErrorMessage } from "../../components/error-message";
import { useAppDispatch } from "../../app/hooks";
import { setSuppliers } from "../../features/suppliers/suppliersSlice";

export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [loginUser] = useLoginMutation();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async (data: UserData) => {
        try {
            setLoading(true);
            const user = await loginUser(data).unwrap();

            dispatch(setSuppliers(user.suppliers));
            setLoading(false);
            navigate(Paths.weekReport);
        } catch (err) {
            setLoading(false);
            const maybeError = isErrorWithMessage(err);

            if (maybeError) {
                setError(err.data.message);
            } else {
                setError("Неизвестная ошибка");
            }
        }
    };

    return (
        <Layout>
            <Row align="middle" justify="center">
                <Card
                    title="Войдите"
                    style={{ width: "30rem", marginTop: "30px" }}
                >
                    <Form onFinish={login}>
                        <CustomInput
                            type="email"
                            name="email"
                            placeholder="Email"
                        />
                        <PasswordInput
                            name="password"
                            placeholder="Пароль"
                            hasFeedback
                        />
                        <CustomButton
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Войти
                        </CustomButton>
                    </Form>
                    <Space
                        direction="vertical"
                        size="small"
                        style={{ marginTop: "20px" }}
                    >
                        <Typography.Text>
                            Нет аккаунта?{" "}
                            <Link to={Paths.register}>Зарегистрируйтесь</Link>
                        </Typography.Text>
                        <ErrorMessage message={error} />
                    </Space>
                </Card>
            </Row>
        </Layout>
    );
};
