import { Layout as AntLayout, Menu, MenuProps } from "antd";
import { Header } from "../header";
import Sider from "antd/es/layout/Sider";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./index.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

type Props = {
    children: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
    const menuProps = [
        {
            lable: "Еженедельные отчеты",
            key: "report",
        },
        {
            lable: "Товары",
            key: "good",
        },
    ];
    const { pathname } = useLocation();

    const pathSegments = pathname.split('/');
    const currentKey = pathSegments.length > 1 ? pathSegments[1] : pathSegments[0];

    const [current, setCurrent] = useState(currentKey);
    const navigate = useNavigate();

    const user = useSelector(selectUser);

    const onClick: MenuProps["onClick"] = (e) => {
        navigate(`/${e.key}`);
        setCurrent(e.key);
    };

    return (
        <div className={styles.main}>
            <Header />
            <AntLayout>
                {user && 
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
                }
                <AntLayout.Content style={{ minHeight: "90vh", paddingLeft: "20px", paddingTop: "10px" }}>
                    {children}
                </AntLayout.Content>
            </AntLayout>
        </div>
    );
};
