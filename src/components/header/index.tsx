import { Divider, Layout, Popover, Select, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../../features/auth/authSlice";
import { SettingOutlined, LogoutOutlined, LoginOutlined, ShopOutlined, UserAddOutlined } from "@ant-design/icons";
import { CustomButton } from "../custom-button";
import styles from "./index.module.css";
import { clearSuppliers, selectSuppliers } from "../../features/suppliers/suppliersSlice";
import { useChangeActiveSupplierMutation } from "../../app/services/supplier";

export const Header = () => {

    const user = useSelector(selectUser);
    const suppliers = useSelector(selectSuppliers);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [changeActiveSupplier] = useChangeActiveSupplierMutation();

    const currentSupplier = suppliers?.suppliers?.find(i => i.is_active === true);
    
    const onLogoutClick = () => {
        dispatch(logout());
        dispatch(clearSuppliers());
        localStorage.removeItem("token");
        navigate('/login');
    }
    
    const userPopover = (
        <div>
            <p className={ styles.populate__header }>Управление аккаунтом</p>
            <CustomButton type="text" onClick={ () => navigate(`${Paths.editUser}/${user?._id}`) }>
                Пользователь
            </CustomButton>
            <CustomButton type="text" onClick={ () => navigate(`${Paths.supplierEditInfo}/${currentSupplier?._id}`)}>
                Поставщик
            </CustomButton>
        </div>
    );

    const changeSupplier = async (e: string) => {
        window.location.reload();
        await changeActiveSupplier(e);
    }
    const supplierPopover = (
        <>
            <Typography>Выберите поставщика</Typography>
            <Select
                defaultValue={currentSupplier?.name}
                style={{ width: 150 }}
                // loading
                options={suppliers?.suppliers?.map(item => (
                    {value: item._id, label: item.name}
                ))}
                onChange={changeSupplier}
            />
            <Divider style={{ margin: "10px 0" }} />
            <CustomButton type="primary" onClick={ () => navigate(Paths.supplierAdd) }>
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
                                    { currentSupplier ? currentSupplier.name
                                        :
                                        <CustomButton type="primary" onClick={ () => navigate(Paths.supplierAdd) }>
                                            Добавить нового
                                        </CustomButton> }
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
