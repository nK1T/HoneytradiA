import React, { useContext, useEffect, useState } from "react";
import styles from "./signals.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImSortNumbericDesc, ImSortNumericAsc } from "react-icons/im";
import { AiOutlineStock } from "react-icons/ai";
import { FiClock } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { LuAlarmClock, LuAlarmClockOff } from "react-icons/lu";

import axios from "axios";
import { MdEmergency, MdWorkspacePremium } from "react-icons/md";
import { IoDocumentSharp } from "react-icons/io5";
import Loader from "../../components/Loader/Loader";

const Signals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const signalsPerPage = 3;
  const [filterStatus, setFilterStatus] = useState("active");
  const [dateFilter, setDateFilter] = useState("earliest");
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Signals";

    // Fetch signals from the API
    const fetchSignals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-signals`,
          {
            withCredentials: true,
          }
        ); // Adjust the endpoint if necessary
        setSignals(response.data.signals);
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  const handleUpdateClick = (signalId) => {
    setPopupData({
      signalId,
      showPopup: true,
      finalStatus: "",
      finalStatusPercent: "",
    });
  };

  const handleSave = async (signalId) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/update-signal/${signalId}`,
        {
          finalStatus: popupData.finalStatus,
          finalStatusPercent: popupData.finalStatusPercent,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        // Optionally update your UI here, e.g., refresh the signal data
        setSignals((prevSignals) =>
          prevSignals.map((signal) =>
            signal._id === signalId
              ? { ...signal, finalStatus: popupData.finalStatus, finalStatusPercent: popupData.finalStatusPercent }
              : signal
          )
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        toast.error("Error:", error.message);
      }
    } finally {
      setLoading(false);
      setPopupData({});
    }
  };

  const handleCancel = () => {
    setPopupData({});
  };

  // Filter the signals based on the selected filter status
  const filteredSignals = signals
    .filter((signal) => {
      if (filterStatus === "all") {
        return true;
      }
      return signal.status === filterStatus;
    })
    .sort((a, b) => {
      if (dateFilter === "earliest") {
        return new Date(a.date) - new Date(b.date);
      } else if (dateFilter === "oldest") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

  // Calculate the signals for the current page
  const indexOfLastSignal = currentPage * signalsPerPage;
  const indexOfFirstSignal = indexOfLastSignal - signalsPerPage;
  const currentSignals = filteredSignals.slice(
    indexOfFirstSignal,
    indexOfLastSignal
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredSignals.length / signalsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDateFilterChange = () => {
    setDateFilter((prev) => (prev === "earliest" ? "oldest" : "earliest"));
  };

  const formatDate = (dateString) => {
    // Create a Date object from the date string
    const date = new Date(dateString);

    // Extract the date components
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
    const year = date.getFullYear();

    // Format the date as DD/MM/YYYY
    return `${day}/${month}/${year}`;
  };
  const formatTime = (timeString) => {
    // Split the input time string into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Convert hours from 24-hour format to 12-hour format
    const isPM = hours >= 12;
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

    // Add AM/PM suffix
    const suffix = isPM ? "PM" : "AM";

    // Format the time string
    return `${formattedHours}:${minutes.toString().padStart(2, "0")}${suffix}`;
  };
  const getDayName = (dateString) => {
    // Create a new Date object from the date string
    const date = new Date(dateString);

    // Array of day names
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get the day name from the Date object
    return daysOfWeek[date.getDay()];
  };
  const calculateTimeAgo = (date) => {
    const uploadedDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = currentDate - uploadedDate;

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  const handleApplyForJob = async (signalId) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/post-entry`,
        { signalId },
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        toast.success(data.message);
        // setSignals((prev) => [...prev, jobId]); // Update appliedJobs state
        // fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while applying for the job.");
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <Sidebar />
        </div>
        <div className={styles.right}>
          <div className={styles.filterControls}>
            <div className={styles.filterButtons}>
              {/* Uncomment and adjust the "All" filter if needed */}
              {/* <button
                className={`${styles.filterButton} ${
                  filterStatus === "all" ? styles.active : ""
                }`}
                onClick={() => handleFilterChange("all")}
              >
                All
              </button> */}
              <button
                className={`${styles.filterButton} ${
                  filterStatus === "active" ? styles.active : ""
                }`}
                onClick={() => handleFilterChange("active")}
              >
                Active
              </button>
              <button
                className={`${styles.filterButton} ${
                  filterStatus === "upcoming" ? styles.active : ""
                }`}
                onClick={() => handleFilterChange("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={`${styles.filterButton} ${
                  filterStatus === "expired" ? styles.active : ""
                }`}
                onClick={() => handleFilterChange("expired")}
              >
                Expired
              </button>
            </div>
            <div className={styles.dateFilter}>
              {dateFilter == "earliest" ? (
                <ImSortNumericAsc
                  color="#892cdc"
                  size={25}
                  cursor="pointer"
                  className={styles.funnelIcon}
                  onClick={handleDateFilterChange}
                />
              ) : (
                <ImSortNumbericDesc
                  color="#892cdc"
                  size={25}
                  cursor="pointer"
                  className={styles.funnelIcon}
                  onClick={handleDateFilterChange}
                />
              )}
            </div>
          </div>
          {currentSignals.length > 0 ? (
            <div className={styles.courses}>
              {currentSignals.map((course) => (
                <div key={course._id} className={styles.course}>
                  <div className={styles.courseImage}>
                    <img src="binance.png" loading="lazy" />
                  </div>
                  <div className={styles.launchDate}>
                    <p>{formatDate(course.createdAt)}</p>
                    <p>{getDayName(course.createdAt)}</p>
                  </div>
                  <div className={styles.courseContent}>
                    <div className={styles.courseContentWrapper}>
                      <>
                        <div className={styles.courseCategory}>
                          <p>
                            <RxUpdate color="#892cdc" />
                            {course.tradingType}
                          </p>
                        </div>
                        <div className={styles.modules}>
                          {/* <FaPlayCircle size={20} color="var(--accent)" /> */}
                          <p>
                            <span style={{ color: "#892cdc" }}>
                              {course.leverage}
                            </span>
                            x
                          </p>
                        </div>
                      </>
                    </div>
                    <div className={styles.bottomItem}>
                      <div className={styles.bottomBoxItem}>
                        <FiClock color="#892cdc" />
                        <span className={styles.label}>First Trade:</span>{" "}
                        <span className={styles.labelAns}>
                          {formatTime(course.firstTrade)}
                        </span>
                      </div>
                      <div className={styles.bottomBoxItem}>
                        <FaCoins color="#892cdc" />
                        <span className={styles.label}>Coin Name:</span>{" "}
                        <span className={styles.labelAns}>
                          {course.coinName}
                        </span>
                      </div>
                      <div className={styles.bottomBoxItem}>
                        <LuAlarmClock color="#892cdc" />
                        <span className={styles.label}>Buy Time:</span>{" "}
                        <span className={styles.labelAns}>
                          {formatTime(course.buyTimeFrom)} -{" "}
                          {formatTime(course.buyTimeTo)}
                        </span>
                      </div>
                      <div className={styles.bottomBoxItem}>
                        <LuAlarmClockOff color="#892cdc" />
                        <span className={styles.label}>Sell Time:</span>{" "}
                        <span className={styles.labelAns}>
                          {formatTime(course.sellTimeFrom)} -{" "}
                          {formatTime(course.sellTimeTo)}
                        </span>
                      </div>
                      <div className={styles.bottomBoxItem}>
                        <AiOutlineStock color="#892cdc" />
                        <span className={styles.label}>
                          Profit Expectations:
                        </span>{" "}
                        <span className={styles.labelAns}>
                          {course.profitExpectationsFrom}% -{" "}
                          {course.profitExpectationsTo}%
                        </span>
                      </div>
                    </div>
                    <div className={styles.exchanges}>
                      {course.exchanges.map((ex) => (
                        <p key={ex}>{ex}</p>
                      ))}
                    </div>
                    <div className={styles.note}>
                      <p>
                        <MdEmergency color="crimson" />
                        {course.rules}
                      </p>
                    </div>
                    {course.status === "expired" && (
                      <div className={styles.finalStatus}>
                        {course.finalStatus ? (
                          <p
                            style={
                              course.finalStatus === "profit"
                                ? { backgroundColor: "forestgreen" }
                                : { backgroundColor: "crimson" }
                            }
                          >
                            {course.finalStatus} - {course.finalStatusPercent}%
                          </p>
                        ) : (
                          <button
                            style={{
                              backgroundColor: "#fab437",
                              color: "black",
                            }}
                            onClick={() => handleUpdateClick(course._id)}
                          >
                            Update Final Status
                          </button>
                        )}
                      </div>
                    )}
                    {popupData.showPopup &&
                      popupData.signalId === course._id && (
                        <div className={styles.popup}>
                          <h4>Update Final Status</h4>
                          <div className={styles.fields}>
                            <select
                              value={popupData.finalStatus}
                              onChange={(e) =>
                                setPopupData((prev) => ({
                                  ...prev,
                                  finalStatus: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select Status</option>
                              <option value="profit">Profit</option>
                              <option value="loss">Loss</option>
                            </select>
                            <input
                              type="number"
                              value={popupData.finalStatusPercent}
                              onChange={(e) =>
                                setPopupData((prev) => ({
                                  ...prev,
                                  finalStatusPercent: e.target.value,
                                }))
                              }
                              placeholder="Enter percentage"
                            />
                          </div>
                          <div className={styles.popupButtons}>
                            <button onClick={() => handleSave(course._id)}>
                              Save
                            </button>
                            <button onClick={handleCancel}>Cancel</button>
                          </div>
                        </div>
                      )}

                    <div className={styles.enroll}>
                      <p>{course.entryCount} Entry</p>
                      {course.status == "active" && (
                        <button onClick={() => handleApplyForJob(course._id)}>
                          Entry
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : loading ? (
            <Loader />
          ) : (
            <div className={styles.noData}>
              <i>
                <IoDocumentSharp />
              </i>
              <p>No {filterStatus} Signal Found</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`${styles.pageButton} ${
                    currentPage === index + 1 ? styles.active : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signals;
