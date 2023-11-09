import { Card, Form, Row, Space, Typography } from "antd";
import { Layout } from "../../components/layout";
import { CustomInput } from "../../components/custom-input";
import { PasswordInput } from "../../components/password-input";
import { CustomButton } from "../../components/custom-button";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useState } from "react";
import { useRegisterMutation } from "../../app/services/auth";
import { isErrorWithMessage } from "../../utils/is-error-with-message";
import { User } from "../../types";
import { ErrorMessage } from "../../components/error-message";

type RegisterData = Omit<User, 'id'> & { confirmPassword: string }

export const Register = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [registerUser] = useRegisterMutation();
  
    const register =  async(data: RegisterData) => {
      try {
        await registerUser(data).unwrap();
  
        navigate(Paths.weekReport);
      } catch (error) {
        const maybeError = isErrorWithMessage(error);
  
        if (maybeError) {
          setError(error.data.message);
        } else {
          setError('Неизвестная ошибка');
        }
      }
    }

    return (
        <Layout>
            <Row align="middle" justify="center">
                <Card title="Зарегистрируйтесь" style={{ width: "30rem", marginTop: '30px' }}>
                    <Form onFinish={ register }>
                        <CustomInput type="name" name="name" placeholder="Имя" />
                        <CustomInput type="email" name="email" placeholder="Email" />
                        <PasswordInput name="password" placeholder="Пароль" />
                        <PasswordInput name="confirmPassword" placeholder="Повторите пароль" />
                        <CustomButton type="primary" htmlType="submit">
                            Зарегистрироваться
                        </CustomButton>
                    </Form>
                    <Space direction="vertical" size='small' style={{ marginTop: '20px' }}>
                        <Typography.Text>
                            Есть аккаунт? <Link to={Paths.login}>Войдите</Link>
                        </Typography.Text>
                        <ErrorMessage message={ error } />
                    </Space>
                </Card>
            </Row>
        </Layout>
    );
};
