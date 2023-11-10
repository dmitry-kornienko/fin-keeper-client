import { Layout } from "../../components/layout";
import { UserEditInfoForm } from "../../components/edit-user-info-form";
import { UserEditPasswordForm } from "../../components/edit-user-password-form";

export const EditUser = () => {
    return (
        <Layout>
            <UserEditInfoForm />
            <UserEditPasswordForm />
        </Layout>
    );
};
