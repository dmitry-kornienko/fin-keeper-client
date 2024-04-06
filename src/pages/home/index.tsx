import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/custom-button";
import { HomeHeader } from "../../components/home-header";
import { Paths } from "../../paths";
import styles from "./index.module.css";

export const Home = () => {

    const navigate = useNavigate();

    return (
        <>
            <HomeHeader />
            <div className={styles.container}>
                <div className={styles.content}>
                    <span>FeenKeeper</span> - сервис автоматического расчета финансовых показательней поставщиков маркетплейса WildBerries.
                    <CustomButton onClick={() => navigate(Paths.register)} size="large" type="primary">
                        Начать работу
                    </CustomButton>
                </div>
            </div>
        </>
    );
};
