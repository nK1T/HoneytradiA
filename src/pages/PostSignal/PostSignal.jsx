import React, { useState } from "react";
import styles from "./postSignal.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const exchangesList = [
    "BINANCE",
    "BIBLOCK",
    "BYBIT",
    "GATE.IO",
    "OKX",
    "KUCOIN",
  ];
  // State for form fields
  const [formData, setFormData] = useState({
    coinName: "",
    date: "",
    exchanges: "",
    tradingType: "",
    leverage: "",
    firstTrade: "",
    buyTimeFrom: "",
    buyTimeTo: "",
    sellTimeFrom: "",
    sellTimeTo: "",
    profitExpectationsFrom: "",
    profitExpectationsTo: "",
    for: "",
    rules: "",
  });

  // State for form errors
  const [errors, setErrors] = useState({});

  // Handle exchange selection
  const toggleExchange = (exchange) => {
    setFormData((prevData) => ({
      ...prevData,
      exchanges: prevData.exchanges.includes(exchange)
        ? prevData.exchanges.filter((ex) => ex !== exchange)
        : [...prevData.exchanges, exchange],
    }));
  };

  // Form validation
  const validate = () => {
    const newErrors = {};
    const {
      coinName,
      date,
      exchanges,
      tradingType,
      leverage,
      firstTrade,
      buyTimeFrom,
      buyTimeTo,
      sellTimeFrom,
      sellTimeTo,
      profitExpectationsFrom,
      profitExpectationsTo,
      rules,
    } = formData;

    if (!coinName) newErrors.coinName = "Coin name is required";
    if (!date) newErrors.date = "Date is required";
    if (!exchanges) newErrors.exchanges = "Exchanges is required";
    if (!tradingType) newErrors.tradingType = "Trading Type is required";
    if (!leverage) newErrors.leverage = "Leverage is required";
    if (!firstTrade) newErrors.firstTrade = "First trade time is required";
    if (!buyTimeFrom) newErrors.buyTimeFrom = "Buy time from is required";
    if (!buyTimeTo) newErrors.buyTimeTo = "Buy time to is required";
    if (!sellTimeFrom) newErrors.sellTimeFrom = "Sell time from is required";
    if (!sellTimeTo) newErrors.sellTimeTo = "Sell time to is required";
    if (!profitExpectationsFrom)
      newErrors.profitExpectationsFrom = "Profit expectations from is required";
    if (!profitExpectationsTo)
      newErrors.profitExpectationsTo = "Profit expectations to is required";
    if (!rules) newErrors.rules = "Rules are required";

    // Validate time sequence: sellTimeTo > sellTimeFrom > buyTimeTo > buyTimeFrom > firstTrade
    if (firstTrade && buyTimeFrom && buyTimeTo && sellTimeFrom && sellTimeTo) {
      if (
        !(
          firstTrade < buyTimeFrom &&
          buyTimeFrom < buyTimeTo &&
          buyTimeTo < sellTimeFrom &&
          sellTimeFrom < sellTimeTo
        )
      ) {
        newErrors.timeSequence =
          "Invalid time sequence. Ensure: sellTimeTo > sellTimeFrom > buyTimeTo > buyTimeFrom > firstTrade.";
      }
    }

    if (profitExpectationsFrom && profitExpectationsTo) {
      if (!(profitExpectationsFrom < profitExpectationsTo)) {
        newErrors.timeSequence =
          "Profit Expectations from must be greated than Profit Expectations to";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to reset the form
  const resetForm = () => {
    setFormData({
      coinName: "",
      date: "",
      exchanges: "",
      tradingType: "",
      leverage: "",
      firstTrade: "",
      buyTimeFrom: "",
      buyTimeTo: "",
      sellTimeFrom: "",
      sellTimeTo: "",
      profitExpectationsFrom: "",
      profitExpectationsTo: "",
      for: "",
      rules: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/create-signal`,
          {
            ...formData,
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
          resetForm(); // Uncomment if you have a resetForm function
          window.scrollTo(0, 0);
        }
        // Optionally reset the form or perform other actions
      } catch (error) {
        // Handle errors, such as network issues or server errors
        if (error.response) {
          // Server responded with a status other than 200 range
          console.error("Error response from server:", error.response.data);
        } else if (error.request) {
          // Request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something else caused the error
          toast.error("Error:", error.message);
        }
      } finally {
        setLoading(false);
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
          {errors.timeSequence && (
            <p style={{ marginBottom: "10px" }} className={styles.errorMessage}>
              {errors.timeSequence}
            </p>
          )}
          <form className={styles.formContainer}>
            <div className={styles.formField}>
              <label>Coin Name</label>
              <select
                name="coinName"
                value={formData.coinName}
                onChange={handleChange}
                className={styles.inputField}
                required
              >
                <option value="" disabled selected>
                  --Select--
                </option>
                <option value="BTC/USDT">BTC/USDT</option>
                <option value="ETH/USDT">ETH/USDT</option>
                <option value="BNB/USDT">BNB/USDT</option>
                <option value="SOL/USDT">SOL/USDT</option>
                <option value="XRP/USDT">XRP/USDT</option>
                <option value="MATIC/USDT">MATIC/USDT</option>
                <option value="DOT/USDT">DOT/USDT</option>
                <option value="ARB/USDT">ARB/USDT</option>
                <option value="DOGE/USDT">DOGE/USDT</option>
                <option value="LINK/USDT">LINK/USDT</option>
                <option value="TRX/USDT">TRX/USDT</option>
                <option value="ADA/USDT">ADA/USDT</option>
                <option value="LTC/USDT">LTC/USDT</option>
                <option value="AAVE/USDT">AAVE/USDT</option>
                <option value="ALICE/USDT">ALICE/USDT</option>
              </select>
              {errors.coinName && (
                <p className={styles.errorMessage}>{errors.coinName}</p>
              )}
            </div>

            <div className={styles.formField}>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && (
                <p className={styles.errorMessage}>{errors.date}</p>
              )}
            </div>
            <div className={styles.formField}>
              <label>Exchanges</label>
              <div className={styles.exchangesContainer}>
                {exchangesList.map((exchange) => (
                  <button
                    key={exchange}
                    type="button"
                    className={`${styles.exchangeButton} ${
                      formData.exchanges.includes(exchange)
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => toggleExchange(exchange)}
                  >
                    {exchange}
                  </button>
                ))}
              </div>
              {errors.exchanges && (
                <p className={styles.errorMessage}>{errors.exchanges}</p>
              )}
            </div>

            <div className={styles.formField}>
              <label className={styles.inputLabel}>Trading Type</label>
              <select
                name="tradingType"
                value={formData.tradingType}
                onChange={handleChange}
                className={styles.inputField}
                required
              >
                <option value="" disabled selected>
                  --Select--
                </option>
                <option value="SPOT TRADING">Spot Trading</option>
                <option value="FUTURE TRADING">Future Trading</option>
              </select>
              {errors.tradingType && (
                <p className={styles.errorMessage}>{errors.tradingType}</p>
              )}
            </div>
            <div className={styles.formField}>
              <label>Leverage</label>
              <input
                type="number"
                name="leverage"
                value={formData.leverage}
                onChange={handleChange}
              />
              {errors.leverage && (
                <p className={styles.errorMessage}>{errors.leverage}</p>
              )}
            </div>

            <div className={styles.formField}>
              <label>First Trade Time</label>
              <input
                type="time"
                name="firstTrade"
                value={formData.firstTrade}
                onChange={handleChange}
              />
              {errors.firstTrade && (
                <p className={styles.errorMessage}>{errors.firstTrade}</p>
              )}
            </div>

            <div className={styles.formField}>
              <label>Buy Time From</label>
              <input
                type="time"
                name="buyTimeFrom"
                value={formData.buyTimeFrom}
                onChange={handleChange}
              />
              {errors.buyTimeFrom && (
                <p className={styles.errorMessage}>{errors.buyTimeFrom}</p>
              )}
            </div>

            <div className={styles.formField}>
              <label>Buy Time To</label>
              <input
                type="time"
                name="buyTimeTo"
                value={formData.buyTimeTo}
                onChange={handleChange}
              />
              {errors.buyTimeTo && (
                <p className={styles.errorMessage}>{errors.buyTimeTo}</p>
              )}
            </div>

            <div className={styles.formField}>
              <label>Sell Time From</label>
              <input
                type="time"
                name="sellTimeFrom"
                value={formData.sellTimeFrom}
                onChange={handleChange}
              />
              {errors.sellTimeFrom && (
                <p className={styles.errorMessage}>{errors.sellTimeFrom}</p>
              )}
            </div>

            <div className={styles.formField}>
              <label>Sell Time To</label>
              <input
                type="time"
                name="sellTimeTo"
                value={formData.sellTimeTo}
                onChange={handleChange}
              />
              {errors.sellTimeTo && (
                <p className={styles.errorMessage}>{errors.sellTimeTo}</p>
              )}
            </div>

            <div className={styles.formField}>
              <label>Profit Expectations From</label>
              <input
                type="number"
                name="profitExpectationsFrom"
                value={formData.profitExpectationsFrom}
                onChange={handleChange}
              />
              {errors.profitExpectationsFrom && (
                <p className={styles.errorMessage}>
                  {errors.profitExpectationsFrom}
                </p>
              )}
            </div>

            <div className={styles.formField}>
              <label>Profit Expectations To</label>
              <input
                type="number"
                name="profitExpectationsTo"
                value={formData.profitExpectationsTo}
                onChange={handleChange}
              />
              {errors.profitExpectationsTo && (
                <p className={styles.errorMessage}>
                  {errors.profitExpectationsTo}
                </p>
              )}
            </div>
            <div className={styles.formField}>
              <label>For</label>
              <select
                name="for"
                value={formData.for}
                onChange={handleChange}
                className={styles.inputField}
                required
              >
                <option value="" disabled selected>
                  --Select--
                </option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="both">Both</option>
              </select>
              {errors.for && (
                <p className={styles.errorMessage}>{errors.for}</p>
              )}
            </div>
            <div className={styles.formField}>
              <label>Rules</label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleChange}
              />
              {errors.rules && (
                <p className={styles.errorMessage}>{errors.rules}</p>
              )}
            </div>
          </form>
          <button onClick={handleSubmit} className={styles.submitButton}>
            Create Signal{loading && <ClipLoader size={13} />}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
