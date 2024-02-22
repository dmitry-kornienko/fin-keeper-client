import { useCurrentQuery } from "../../app/services/auth";
import { useSuppliersCurrentUserQuery } from "../../app/services/supplier";
import { Loader } from "../../components/loader";

export const Auth = ({ children }: { children: JSX.Element }) => {
    const { isLoading } = useCurrentQuery();
    const { isLoading: isLoadingSuppliers } = useSuppliersCurrentUserQuery();

    if (isLoading || isLoadingSuppliers) {
        return <Loader />;
    }
    return children;
};
