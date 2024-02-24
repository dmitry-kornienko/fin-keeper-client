import { Layout } from "../../components/layout";
import { UserEditInfoForm } from "../../components/edit-user-info-form";
import { UserEditPasswordForm } from "../../components/edit-user-password-form";
import styles from './index.module.css';

export const EditUser = () => {
    return (
        <Layout>
            <div className={ styles.editUserPage }>
                <UserEditInfoForm />
                <UserEditPasswordForm />
            </div>
        </Layout>
    );
};
