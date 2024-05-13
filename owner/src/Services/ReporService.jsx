import axios from "axios";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const generateInventoryReport = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Access token not found");
    toast.error("Access token not found", {
      position: "top-right",
      autoClose: 3500,
    });
    return;
  }

  axios({
    method: "post",
    url: "http://localhost:5000/ownerReportServices/inventory-report/createInventoryReport",
    headers: { "x-access-token": accessToken },
    responseType: "blob",
  })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      saveAs(pdfBlob, "InventoryReport.pdf");
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF", {
        position: "top-right",
        autoClose: 3500,
      });
    });
};

const generateSalesReport = async (fromDate, toDate) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("Access token not found");
    toast.error("Access token not found", {
      position: "top-right",
      autoClose: 3500,
    });
    return;
  }
  //add one day to toDate
  toDate = toDate.add(1, "day");
  //formatting the date
  fromDate = fromDate.format("YYYY-MM-DD");
  toDate = toDate.format("YYYY-MM-DD");
  console.log(fromDate, toDate);
  axios({
    method: "post",
    url: "http://localhost:5000/ownerReportServices/sales-report/createSalesReport",
    headers: { "x-access-token": accessToken },
    data: { startDate: fromDate, endDate: toDate },
    responseType: "blob",
  })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      saveAs(pdfBlob, "SalesReport.pdf");
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
      try {
        toast.error(error, {
          position: "top-right",
          autoClose: 3500,
        });
      } catch (err) {
        console.log(err);
        toast.error("Error generating PDF", {
          position: "top-right",
          autoClose: 3500,
        });
      }
    });
  <ToastContainer />;
};

export { generateInventoryReport, generateSalesReport };
