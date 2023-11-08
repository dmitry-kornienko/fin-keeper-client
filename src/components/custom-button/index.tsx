import { Button, Form } from 'antd';

type Props = {
    children?: React.ReactNode;
    htmlType?: "button" | "submit" | "reset" | undefined;
    onClick?: () => void;
    type?: "link" | "text" | "default" | "primary" | "dashed" | undefined;
    danger?: boolean;
    loading?: boolean;
    shape?: "default" | "circle" | "round" | undefined;
    icon?: React.ReactNode;
    size?: 'small' | 'large' | 'middle';
    disabled?: boolean
}

export const CustomButton: React.FC<Props> = ({
    children,
    htmlType='button',
    onClick,
    type,
    danger,
    loading,
    shape,
    icon,
    size,
    disabled
}) => {
  return (
    <Form.Item style={{ marginBottom: '0px' }}>
        <Button
            htmlType={ htmlType }
            onClick={ onClick }
            type={ type }
            danger={ danger }
            loading={ loading }
            shape={ shape }
            icon={ icon }
            size={ size }
            disabled={ disabled }
        >
            { children }
        </Button>
    </Form.Item>
  )
}
