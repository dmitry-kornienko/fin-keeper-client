export type ErrorWithMessage = {
    status: number;
    data: {
        message: string;
    };
};

export type User = {
    _id: string;
    name: string;
    email: string;
    password: string;
    bill: number;
    tokenWB: string;
    isActivated: boolean;
    activationLink: string;
}

export type Report = {
    _id: string,
    realizationreport_id: number,
    date_from: string, 
    date_to: string,

    sale_sum_before_comission: number, // Продажа до вычета комиссии (1)
    sale_count_before_comission: number, // Кол-во продаж до вычета комиссии (2)

    return_sum_before_comission: number, // Сумма возвратов до комиссии (3)
    return_count_before_comission: number, // Кол-во возвратов до комиссии (4)
    
    sale_sum_after_comission: number, // Продажа после вычета комиссии (5)
    return_sum_after_comission: number, // Сумма возвратов после вычета комиссии (6)

    comission_sum: number, // Сумма комиссии (7)
    comission_rate: number, // Процент комиссии (8)

    scrap_payment_sum: number, // Оплата брака (9)
    scrap_payment_count: number, // Кол-во оплат брака (10)

    lost_goods_payment_sum: number, // Оплата потерянного товара (11)
    lost_goods_payment_count: number, // Кол-во оплат потерянного товара (12)

    substitute_compensation_sum: number, // Компенсация подмененного товара (13)
    substitute_compensation_count: number, // Кол-во компенсаций подмененного товара (14)

    freight_reimbursement_sum: number, // Возмещение издержек по перевозке (15)
    freight_reimbursement_count: number, // Кол-во возмещений издержек по перевозке (16)

    sales_reversal_sum: number, // Сторно продаж (17)
    sales_reversal_count: number, // Кол-во сторно продаж (18)

    correct_sale_sum: number, // Корректная продажа (19)
    correct_sale_count: number, // Кол-во корректных продажа (20)

    reversal_returns_sum: number, // Сторно возвратов (21)
    reversal_returns_count: number, // Кол-во сторно возвратов (22)

    correct_return_sum: number, // Корректный возврат (23)
    correct_return_count: number, // Кол-во корректных возвратов (24)

    adjustment_amount_sum: number, // Сумма корректировок (25)
    adjustment_amount_count: number, // Кол-во корректировок (26)

    sale: number, // Продано ВБ (27)
    ppvz_for_pay: number, // К перечислению за товар (28)

    delivery_to_customer_sum: number, // Заказы (доставки) (29)
    delivery_to_customer_count: number, // Кол-во доставок до покупателя (30)

    delivery_return_sum: number, // Возвраты (обратная логистика) (31)
    delivery_return_count: number, // Кол-во оплат возвратов (32)

    delivery_sum: number, // Логистика (33)
    delivery_count: number, // Кол-во доставок (34)

    penalty: number, // Штрафы (35)

    additional_payment: number, // Доплаты (36)

    storage: number, // Хранение (37)

    taking_payment: number, // Стоимость платной приемки (38)

    other_deductions: number, // Прочие удержания (39)

    cost_price_sum: number, // Себестоимость товара (41)
    cost_price_precent: number, // % Себестоимости (42)

    gross_profit: number, // Валовая прибыль (43)

    tax_sum: number, // Налоги (44)
    tax_precent: number, // Процентная ставка налога (45)

    final_profit: number, // Итоговая прибыль (46)

    investment_return: number, // Рентабельность вложений (47)

    business_costs: number, // Расходы бизнеса (48)

    net_profit: number, // Чистая прибыль (49)

    composition: {
        article: string,
        cost_price: number, // Себестоимость единицы
        retail_amount: number, // Продано ВБ
        sale_count: number, // Кол-во продаж
        return_count: number, // Кол-во возвратов
        sale_sum: number, // Сумма продаж (ppvz_for_pay)
        return_sum: number, // Сумма возвратов
        delivery: number, // Логистика        
    }[]
}

export type DetalizationItem = {
    realizationreport_id: number,
    date_from: string,
    date_to: string,
    sa_name: string,
    doc_type_name: string,
    quantity: any,
    retail_amount: number,
    supplier_oper_name: string,
    retail_price_withdisc_rub: number,
    delivery_amount: number,
    delivery_rub: number,
    ppvz_for_pay: number,
    penalty: number,
    additional_payment: number,
}

export type Good = {
    _id: string,
    article: string,
    cost_price: number
}