import { Layout as AntLayout, Menu, MenuProps } from "antd";
import { Header } from "../header";
import Sider from "antd/es/layout/Sider";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./index.module.css";

type Props = {
    children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
    const menuProps = [
        {
            lable: "Еженедельные отчеты",
            key: "week-report",
        },
        {
            lable: "Товары",
            key: "good",
        },
    ];
    const { pathname } = useLocation();

    const [current, setCurrent] = useState(`${pathname.slice(1)}`);
    const navigate = useNavigate();

    const onClick: MenuProps["onClick"] = (e) => {
        navigate(`/${e.key}`);
        setCurrent(e.key);
    };

    return (
        <div className={styles.main}>
            <Header />
            <AntLayout>
                <Sider breakpoint="lg">
                    <Menu
                        mode="inline"
                        onClick={onClick}
                        selectedKeys={[current]}
                        items={menuProps.map((item) => ({
                            key: item.key,
                            label: item.lable,
                        }))}
                        style={{ minHeight: "100%", borderRight: 0 }}
                    />
                </Sider>
                <AntLayout.Content style={{ minHeight: "90vh" }}>
                    {children}
                </AntLayout.Content>
            </AntLayout>
        </div>
    );
};
