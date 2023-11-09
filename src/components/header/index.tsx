import { Divider, Layout, Popover, Select, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../features/auth/authSlice";
import { SettingOutlined, LogoutOutlined, LoginOutlined, ShopOutlined, UserAddOutlined } from "@ant-design/icons";
import { CustomButton } from "../custom-button";
import styles from "./index.module.css";

export const Header = () => {

    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onLogoutClick = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/login');
    }

    const userPopover = (
        <div>
            <p className={ styles.populate__header }>Управление аккаунтом</p>
            <CustomButton type="text" onClick={ () => navigate(`${Paths.editUser}/${user?._id}`) }>
                Пользователь
            </CustomButton>
            <CustomButton type="text" >
                Поставщик
            </CustomButton>
        </div>
    );
    const supplierPopover = (
        <>
            <Typography>Выберите поставщика</Typography>
            <Select
                defaultValue="ИП Иванов"
                style={{ width: 150 }}
                // loading
                options={[
                    { value: 'ИП Иванов', label: 'ИП Иванов' },
                    { value: 'ИП Сверидов', label: 'ИП Сверидов' },
                ]}
            />
            <Divider style={{ margin: "10px 0" }} />
            <CustomButton type="primary">
                Добавить нового
            </CustomButton>
        </>
    );

    return (
        <Layout.Header className={styles.header}>
            <Space>
                <Link to={Paths.weekReport}>
                    <Typography className={styles.logo}>FinKeeper</Typography>
                </Link>
            </Space>
            {
                user ? (
                    <>
                        <Space>
                            <Popover content={supplierPopover} trigger='click'>
                                <CustomButton type="default" icon={ <ShopOutlined /> }>
                                    ИП Иванов
                                 </CustomButton>
                            </Popover>
                            <Popover content={userPopover} trigger="click">
                                <CustomButton type="text" icon={ <SettingOutlined /> }>
                                    {user.name}
                                </CustomButton>
                            </Popover>
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
