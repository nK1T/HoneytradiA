import React from "react";
import { Link } from "react-router-dom";
import styles from "./sidebar.module.scss";
import { GiTrade } from "react-icons/gi";
import { MdAddBox, MdWorkspacePremium } from "react-icons/md";

const Sidebar = () => {
  return (
    <div>
      <ul className={styles.sidebarItems}>
        <Link to="/">
          <li
            className={`${styles.sidebarItem} ${
              location.pathname === "/" ? styles.active : ""
            }`}
          >
            <GiTrade color="#892cdc" />
            Signals
          </li>
        </Link>
        <Link to="/post-signal">
          <li
            className={`${styles.sidebarItem} ${
              location.pathname === "/post-signal" ? styles.active : ""
            }`}
          >
            <MdAddBox color="#892cdc" />
            Post Signal
          </li>
        </Link>
        <Link to="/verify-membership">
          <li
            className={`${styles.sidebarItem} ${
              location.pathname === "/verify-membership" ? styles.active : ""
            }`}
          >
            <MdWorkspacePremium color="#892cdc" />
            Verify Membership
          </li>
        </Link>
        {/* <Link to="/orders">
          <li
            className={`${styles.sidebarItem} ${
              location.pathname === "/orders" ? styles.active : ""
            }`}
          >
            <FaReceipt color="#892cdc" />
            Orders<FaLock color="#F0B90B" size={12}/>
          </li>
        </Link> */}
        {/* <Link to="/my-entries">
          <li
            className={`${styles.sidebarItem} ${
              location.pathname === "/my-entries" ? styles.active : ""
            }`}
          >
            <IoIosCloudDone color="#892cdc" />
            My Entries
          </li>
        </Link>
        <Link to="/invites">
          <li
            className={`${styles.sidebarItem} ${
              location.pathname === "/invites" ? styles.active : ""
            }`}
          >
            <IoGiftSharp color="#892cdc" />
            My Invites
          </li>
        </Link>
        <Link to="/membership">
          <li
            className={`${styles.sidebarItem} ${
              location.pathname === "/membership" ? styles.active : ""
            }`}
          >
            <MdWorkspacePremium color="#892cdc" />
            Membership
          </li>
        </Link> */}
      </ul>
    </div>
  );
};

export default Sidebar;
