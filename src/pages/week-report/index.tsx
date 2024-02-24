import { CustomButton } from "../../components/custom-button";
import { Layout } from "../../components/layout";
import { WeekReports } from "../../components/week-reports";
import styles from "./index.module.css";

export const WeekReportsPage = () => {
    const addReport = () => {
        console.log('Adding new report')
    } 
    return (
        <Layout>
            <div className={ styles.weekReportPage }>
                <CustomButton onClick={ addReport } type="primary">Добавить отчет</CustomButton>
                <WeekReports />
            </div>
        </Layout>
    );
};
