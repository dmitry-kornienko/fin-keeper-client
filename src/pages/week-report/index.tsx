import { CustomButton } from "../../components/custom-button";
import { Layout } from "../../components/layout";
import { WeekReports } from "../../components/week-reports";

export const WeekReportsPage = () => {
    const addReport = () => {
        console.log('Adding new report')
    } 
    return (
        <Layout>
            <CustomButton onClick={ addReport } type="primary">Добавить отчет</CustomButton>
            <WeekReports />
        </Layout>
    );
};
