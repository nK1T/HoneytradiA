import React from "react";
import styles from "./navbar.module.scss";

const Navbar = () => {
  return (
    <nav className={styles.navContainer}>
      <div className={styles.left}>
        <a href="/" className={styles.logo}>
          {/* <img src="/logo2.png" /> */}
          <p>HoneyTradi</p>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
