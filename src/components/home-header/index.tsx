import { Layout, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { CustomButton } from "../custom-button";
import styles from "./index.module.css";
import { useEffect } from "react";

export const HomeHeader = () => {

    const user = useSelector(selectUser);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user) {
            navigate(Paths.weekReport)
        }
    }, [navigate, user])

    return (
        <div className={styles.wrapper}>
            <Layout.Header className={styles.header}>
                <Space>
                   <Typography className={styles.logo}>FinKeeper</Typography>
                </Space>
                <CustomButton onClick={() => navigate(Paths.register)}>
                    Начать работу
                </CustomButton>
            </Layout.Header>
        </div>
    );
};
