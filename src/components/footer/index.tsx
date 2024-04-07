import styles from "./index.module.css";

export const Footer = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.footer__content}></div>
                <p>© 2024 Все права защищены</p>
            </div>
        </div>
    );
};
