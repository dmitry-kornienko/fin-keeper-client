import { Layout, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../features/auth/authSlice";
import { LogoutOutlined, LoginOutlined, UserAddOutlined, SettingOutlined } from "@ant-design/icons";
import { CustomButton } from "../custom-button";
import styles from "./index.module.css";

export const Header = () => {

    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    
    const onLogoutClick = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate('/login');
    }

    return (
        <Layout.Header className={styles.header}>
            <Space>
                <Link to={user ? Paths.weekReport : Paths.home}>
                    <Typography className={styles.logo}>FinKeeper</Typography>
                </Link>
            </Space>
            {
                user ? (
                    <>
                        <Space>
                            <div>{user.name}</div>
                            <CustomButton type="text" icon={ <SettingOutlined /> } onClick={ () => navigate(`${Paths.editUser}/${user._id}`) } />
                            <div>Баланс: {user.bill}</div>
                        </Space>
                        <CustomButton type='text' icon={ <LogoutOutlined /> } onClick={ onLogoutClick }>
                            Выйти
                        </CustomButton>
                    </>
                ) : 
                <Space>
                    <Link to={ Paths.register }>
                        <CustomButton type='text' icon={ <UserAddOutlined /> }>
                            Зарегистрироваться
                        </CustomButton>
                    </Link>
                    <Link to={ Paths.login }>
                        <CustomButton type='text' icon={ <LoginOutlined /> }>
                            Войти
                        </CustomButton>
                    </Link>
                </Space>
            }
        </Layout.Header>
    );
};
