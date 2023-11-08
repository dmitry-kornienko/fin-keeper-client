import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./index.module.css";

export const Loader = () => {
    return (
        <div className={styles.loader}>
            <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
        </div>
    );
};
