import React, { useEffect, useState } from "react";
import styles from "./verifyMembership.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import { IoDocumentSharp } from "react-icons/io5";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import axios from "axios";
import { ImSortNumbericDesc, ImSortNumericAsc } from "react-icons/im";
import Modal from "../../components/Modal/Modal";

const VerifyMembership = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [memberships, setMemberships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [dateFilter, setDateFilter] = useState("earliest");
  const membershipsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Pending Memberships";

    // Fetch memberships from the API
    const fetchMemberships = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-pending-memberships`,
          {
            withCredentials: true,
          }
        ); // Adjust the endpoint if necessary
        setMemberships(response.data.pendingMemberships);
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDateFilterChange = () => {
    setDateFilter((prev) => (prev === "earliest" ? "oldest" : "earliest"));
  };

  // Filter the signals based on the selected filter status
  const filteredMemberships = memberships
    .filter((membership) => {
      if (filterStatus === "all") {
        return true;
      }
      return membership.status === filterStatus;
    })
    .sort((a, b) => {
      if (dateFilter === "earliest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (dateFilter === "oldest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  const handleUpdateClick = (paymentId) => {
    setPopupData({
      paymentId,
      showPopup: true,
      status: "",
    });
  };

  const handleSave = async (paymentId) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/update-payment-status/${paymentId}`,
        {
          status: popupData.status,
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
        // Update the UI if necessary
        setMemberships((prevPayments) =>
          prevPayments.map((payment) =>
            payment._id === paymentId
              ? { ...payment, status: popupData.status }
              : payment
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the memberships for the current page
  const indexOfLastPayment = currentPage * membershipsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - membershipsPerPage;
  const currentMemberships = filteredMemberships.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredMemberships.length / membershipsPerPage);

  function formatDateTime(dateTimeString) {
    // Create a new Date object from the input string
    const date = new Date(dateTimeString);

    // Define arrays for months and AM/PM
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    // Format the date components
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Format the time components
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Construct the final formatted date and time string
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  }

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
                  filterStatus === "pending" ? styles.active : ""
                }`}
                onClick={() => handleFilterChange("pending")}
              >
                Pending
              </button>
              <button
                className={`${styles.filterButton} ${
                  filterStatus === "verified" ? styles.active : ""
                }`}
                onClick={() => handleFilterChange("verified")}
              >
                Verified
              </button>
              <button
                className={`${styles.filterButton} ${
                  filterStatus === "rejected" ? styles.active : ""
                }`}
                onClick={() => handleFilterChange("rejected")}
              >
                Rejected
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
          {currentMemberships.length > 0 ? (
            <table className={styles.membershipTable}>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Date/Time</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Transaction ID</th>
                  <th>Transaction Proof</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMemberships.map((course, i) => (
                  <tr key={course._id}>
                    <td>
                      <span className={styles.labelAns}>{i + 1}</span>
                    </td>
                    <td>
                      <span className={styles.labelAns}>
                        {formatDateTime(course.createdAt)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.labelAns}>
                        {course.userId.email}
                      </span>
                    </td>
                    <td>
                      <span className={styles.labelAns}>{course.amount}$</span>
                    </td>
                    <td>
                      <span className={styles.labelAns}>
                        {course.transactionId}
                      </span>
                    </td>
                    <td>
                      <span
                        className={styles.viewLink}
                        onClick={() => {
                          setScreenshotUrl(
                            `${
                              import.meta.env.VITE_API_URL
                            }/get-transaction-screenshot/${course._id}`
                          );
                          setShowModal(true);
                        }}
                      >
                        View
                      </span>
                    </td>
                    {showModal && (
                      <Modal
                        url={screenshotUrl}
                        onClose={() => setShowModal(false)}
                      />
                    )}
                    <td>
                      <span
                        className={styles.labelAns}
                        style={{
                          color:
                            course.status === "verified"
                              ? "forestgreen"
                              : course.status === "rejected"
                              ? "crimson"
                              : "#fab437",
                        }}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td>
                      <button
                        style={{
                          backgroundColor: "#fab437",
                          color: "black",
                        }}
                        onClick={() => handleUpdateClick(course._id)}
                        className={styles.updateBtn}
                      >
                        Update Status
                      </button>
                      {popupData.showPopup &&
                        popupData.paymentId === course._id && (
                          <div className={styles.popup}>
                            <h4>Update Status</h4>
                            <div className={styles.fields}>
                              <select
                                value={popupData.status}
                                onChange={(e) =>
                                  setPopupData((prev) => ({
                                    ...prev,
                                    status: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Select Status</option>
                                <option value="rejected">Reject</option>
                                <option value="verified">Verified</option>
                              </select>
                            </div>
                            <div className={styles.popupButtons}>
                              <button onClick={() => handleSave(course._id)}>
                                Save
                              </button>
                              <button onClick={handleCancel}>Cancel</button>
                            </div>
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : loading ? (
            <Loader />
          ) : (
            <div className={styles.noData}>
              <i>
                <IoDocumentSharp />
              </i>
              <p>No pending membership found</p>
            </div>
          )}
        </div>
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
  );
};

export default VerifyMembership;
