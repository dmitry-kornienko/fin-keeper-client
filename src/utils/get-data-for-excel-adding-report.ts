import { ExcelDataRow } from "../components/report-excel-form";

// type Data = {
//     arr: ExcelDataRow[],
//     dateFrom: string,
//     dateTo: string,
//     realizationreport_id: number
// }
// type ReturnData = {
//     realizationreport_id: number,
//     date_from: string,
//     date_to: string,
//     sa_name: string,
//     doc_type_name: string,
//     quantity: any,
//     retail_amount: number,
//     supplier_oper_name: string,
//     retail_price_withdisc_rub: number,
//     delivery_amount: number,
//     delivery_rub: number,
//     ppvz_for_pay: number,
//     penalty: number,
//     additional_payment: number,
// }

export const getDataForExcelAddingReport = (data: { arr: ExcelDataRow[], dateFrom: string, dateTo: string, realizationreport_id: number }): any[] => {

    const detalizationArr = data.arr.map(row => ({
        realizationreport_id: data.realizationreport_id,
        date_from: data.dateFrom,
        date_to: data.dateTo,
        sa_name: row["Артикул поставщика"],
        doc_type_name: row["Тип документа"],
        quantity: row["Кол-во"],
        retail_amount: row["Вайлдберриз реализовал Товар (Пр)"],
        supplier_oper_name: row["Обоснование для оплаты"],
        retail_price_withdisc_rub: row["Цена розничная с учетом согласованной скидки"],
        delivery_amount: row["Количество доставок"],
        delivery_rub: row["Услуги по доставке товара покупателю"],
        ppvz_for_pay: row["К перечислению Продавцу за реализованный Товар"],
        penalty: row["Общая сумма штрафов"],
        additional_payment: row["Доплаты"],
        storage_fee: row["Хранение"],
        deduction: row["Удержания"],
        acceptance: row["Платная приемка"]
    }))

    return detalizationArr
}