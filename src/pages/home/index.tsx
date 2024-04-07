import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/custom-button";
import { HomeHeader } from "../../components/home-header";
import { Paths } from "../../paths";
import styles from "./index.module.css";

type Rate = {
    id: number;
    name: string;
    price: number;
    report_count: number;
};

export const Home = () => {
    const navigate = useNavigate();

    const rates: Rate[] = [
        {
            id: 1,
            name: "Начало",
            price: 350,
            report_count: 1,
        },
        {
            id: 2,
            name: "Стандарт",
            price: 900,
            report_count: 3,
        },
        {
            id: 3,
            name: "Продвинутый",
            price: 1750,
            report_count: 6,
        },
        {
            id: 4,
            name: "Премиум",
            price: 2500,
            report_count: 9,
        },
    ];

    const getPrecentOfDiscount = (rate: Rate): string | null => {
        const basePrice = rates[0].price;

        const precent = Math.round(
            ((basePrice * rate.report_count - rate.price) / rate.price) * 100
        );

        return precent ? ` -${precent}%` : null;
    };

    return (
        <>
            <HomeHeader />
            <div className={styles.container}>
                <div className={styles.header}>
                    <span>FinKeeper</span> - сервис автоматического расчета
                    финансовых показателей поставщиков маркетплейса WildBerries.
                    <img src="/img/1.jpg" alt="header" />
                    <CustomButton
                        onClick={() => navigate(Paths.register)}
                        size="large"
                        type="primary"
                    >
                        Начать работу
                    </CustomButton>
                </div>
                <div className={styles.reportList}>
                    <img
                        className={styles.reportList__img}
                        src="/img/reportList.png"
                        alt="reportList"
                    />
                    <div className={styles.reportList__description}>
                        <p>
                            Информативная таблица с основными параметрами
                            отчетов.
                        </p>
                        <p>
                            Возможность добавления новых отчетов через API или
                            Excel файл детализации отчета.
                        </p>
                    </div>
                </div>
                <div className={styles.report}>
                    <div className={styles.report__description}>
                        <p>
                            Подробная деталицаия отчета, предоставляющая всю
                            информацию о ваших продажах за конкретную неделю.
                        </p>
                        <p>Полная информация по каждому артикулу.</p>
                    </div>
                    <img
                        className={styles.report__img}
                        src="/img/report.png"
                        alt="report"
                    />
                </div>
                <div className={styles.advantages}>
                    <div className={styles.advantages__text}>
                        <p>
                            Главное приемущество сервиса - простота
                            использования.
                        </p>
                        <p>
                            Что бы взять под контроль все параметры финансовых
                            отчетов необходимо просто зарегистрироваться.
                        </p>
                        <p>Добавление отчетов происходит в пару кликов.</p>
                    </div>
                    <img src="img/2.png" alt="advantages" />
                </div>
                <div className={styles.prices}>
                    <div className={styles.prices__header}>Тарифы</div>
                    <div className={styles.rates}>
                        {rates.map((i) => (
                            <div className={styles.rate}>
                                <div className={styles.rate__name}>
                                    {i.name}
                                    {i.id === 1 ? null : (
                                        <span>{getPrecentOfDiscount(i)}</span>
                                    )}
                                </div>
                                <div className={styles.rate__price}>
                                    {i.price} руб.
                                </div>
                                {i.id !== 1 && (
                                    <div className={styles.rate__prevPrice}>
                                        {i.report_count * rates[0].price} руб.
                                    </div>
                                )}
                                <div>
                                    {i.report_count} отчет
                                    {i.id === 1
                                        ? ""
                                        : i.report_count === 3
                                        ? "а"
                                        : "ов"}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p>
                        При регистрации каждому пользователю начисляется 5
                        запросов
                    </p>
                    <CustomButton
                        onClick={() => navigate(Paths.register)}
                        size="large"
                        type="primary"
                    >
                        Начать работу
                    </CustomButton>
                </div>
                <div className={styles.newFeature}>
                    <div className={styles.newFeature__header}>
                        Работа над развитием сервиса продолжается
                    </div>
                    <div className={styles.newFeature__blocks}>
                        <div className={styles.newFeature__block}>
                            Ведется разработка рекламного биддера для
                            автоматического управления рекламными ставками.
                        </div>
                        <div className={styles.newFeature__block}>
                            Так же планируется введение системы складского учета
                            для ваших товаров.
                        </div>
                    </div>
                    <div className={styles.newFeature__footer}>
                        Присоединяйтесь к нам и следите за всеми обновлениями.
                    </div>
                </div>
            </div>
        </>
    );
};
