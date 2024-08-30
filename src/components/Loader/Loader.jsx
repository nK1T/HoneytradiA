import React, { useEffect } from "react";
import styles from "./loader.module.scss"

const Loader = () => {
  useEffect(() => {
    async function getLoader() {
      const { infinity } = await import("ldrs");
      infinity.register();
    }
    getLoader();
  }, []);
  return (
    <div
    className={styles.loaderContainer}
    >
      <l-infinity
        size="55"
        stroke="4"
        stroke-length="0.15"
        bg-opacity="0.1"
        speed="1.3"
        color="#892cdc"
      ></l-infinity>
    </div>
  );
};

export default Loader;