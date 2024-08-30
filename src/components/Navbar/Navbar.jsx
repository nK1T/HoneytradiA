import React, { useContext, useEffect, useState } from "react";
import styles from "./navbar.module.scss";
import { MdAddBox, MdWorkspacePremium } from "react-icons/md";
import { GiHamburgerMenu, GiTrade } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaAngleDown, FaAngleUp, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const Navbar = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  const navigate = useNavigate();
  const menuItems = [
    {
      icon: GiTrade,
      text: "Signals",
      submenu: false,
      link: "/",
    },
    {
      icon: MdAddBox,
      text: "Post Signal",
      submenu: false,
      link: "/post-signal",
    },
    {
      icon: MdWorkspacePremium,
      text: "Verify Membership",
      submenu: false,
      link: "/verify-membership",
    },
  ];
  const [activeHamburger, setActiveHamburger] = useState(false);
  useEffect(() => {
    if (activeHamburger) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto"; // Ensure overflow is reset when component unmounts
    };
  }, [activeHamburger]);
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/logout`,
        {
          withCredentials: true,
        }
      );
      setIsAuthorized(false);
      navigate("/login");
      setUser({}); // Clear user state
    } catch (error) {
      console.log(error);
      setIsAuthorized(true);
    }
  };
  return (
    <nav className={styles.navContainer}>
      <div className={styles.left}>
        <a href="/" className={styles.logo}>
          {/* <img src="/logo2.png" /> */}
          <p>HoneyTradi</p>
        </a>
      </div>
      <div className={styles.right}>
        <div className={styles.icons}>
        <i
              onClick={() => setActiveHamburger(true)}
              className={styles.hamBurger}
            >
              <GiHamburgerMenu size={25} />
            </i>
        </div>
      {activeHamburger && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={styles.hamContainer}
        >
          <div className={styles.closeBtn}>
            <i onClick={() => setActiveHamburger(false)}>
              <IoMdClose size={25} />
            </i>
          </div>
          <ul className={styles.items}>
            {!isAuthorized ? (
              <div className={styles.hamBtns}>
                <button
                  onClick={() => navigate("/login")}
                  className={styles.btn1}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className={styles.btn2}
                >
                  Signup
                </button>
              </div>
            ) : (
              <>
                {menuItems.map((item, index) => (
                  <Link to={item.link} key={index} onClick={() => setActiveHamburger(false)}>
                    <li
                      className={styles.hamLinks}
                    >
                      <div className={styles.hamLink}>
                        <span>
                          <i>
                            <item.icon />
                          </i>
                          {item.text}
                        </span>
                      </div>
                    </li>
                  </Link>
                ))}
              </>
            )}
            {isAuthorized && (
              <div className={styles.logout}>
                <button onClick={handleLogout} className={styles.btn1}>
                  Logout
                </button>
              </div>
            )}
            <li className={styles.hamBottom}>
              <div className={styles.lang}>
                <FaGlobe size={20} />
                English (India)
              </div>
              <div className={styles.currency}>
                <AiFillDollarCircle size={23} />
                USD-$
              </div>
            </li>
          </ul>
        </motion.div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
