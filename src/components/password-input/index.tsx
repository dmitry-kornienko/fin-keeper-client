import { Form, Input } from "antd";
import { NamePath } from "antd/es/form/interface";

type Props = {
    name: string;
    placeholder: string;
    dependencies?: NamePath[];
    hasFeedback?: boolean
};

export const PasswordInput: React.FC<Props> = ({
    name,
    placeholder,
    dependencies,
    hasFeedback,
}) => {
    return (
        <Form.Item
            name={name}
            dependencies={dependencies}
            hasFeedback={hasFeedback}
            rules={[
                {
                    required: true,
                    message: "Обязательное поле",
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value) {
                            return Promise.resolve();
                        }

                        if (name === "confirmPassword") {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject(
                                new Error("Пароли должны совпадать")
                            );
                        } else {
                            if (value.length < 6) {
                                return Promise.reject(
                                    new Error(
                                        "Минимальная длина 6 символов"
                                    )
                                );
                            }

                            return Promise.resolve();
                        }
                    },
                }),
            ]}
        >
            <Input.Password placeholder={placeholder} size="large" />
        </Form.Item>
    );
};
