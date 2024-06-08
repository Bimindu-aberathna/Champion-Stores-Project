import React, { useState, useRef, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import SideNavbar from "../Components/SideNavbar";
import { Modal, Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SalesGraph from "../Components/SalesGraph";
import TopSellersChart from "../Components/TopSellersChart";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { generateInventoryReport,generateSalesReport} from "../Services/ReporService";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./Report.css";

function Reports() {
  const [showConfirmation, setShowConfirmation] = useState(false); // State variable to store the confirmation status
  const [toDate, setToDate] = useState(dayjs()); // State variable to store the to date
  const [fromDate, setFromDate] = useState(dayjs().subtract(3, "month")); // State variable to store the from date


  const handleCloseConfirmation = () => { // Function to close the confirmation modal
    setShowConfirmation(false);
  };

  const handleShowConfirmation = () => { // Function to show the confirmation modal
    setShowConfirmation(true);
  };
  const handleGenerateInvReport = async () => { // Function to generate the inventory report
    handleShowConfirmation();
    await generateInventoryReport();
  };

  const handleGenerateSalesReport = async () => { // Function to generate the sales report
    if (fromDate > toDate) { // Check if the from date is greater than the to date
      toast.error("From date should be less than to date", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    }else if (toDate > dayjs()) { // Check if the to date is greater than today
      toast.error("To date should be less than today", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    }else if(toDate.diff(fromDate, 'month')<3){ // Check if the difference between the from date and to date is less than 3 months
      toast.error("Minimum 3 months gap required", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    }
    handleShowConfirmation();
    await generateSalesReport(fromDate, toDate);
  }

  return (
    <div style={{ width: "100%", marginTop: "1rem" }}>
      <SideNavbar selected="Reports"/>
      <div style={{ marginLeft: "6.5rem" }}>
        <Row style={{ width: "100%" }}>
          <Col style={{ zIndex: "800" }} sm={8}>
            <h1>Reports & Analytics</h1>
            {/* Display the sales projection graph */}
            <Card className="containerCard">
              <Card.Body>
                <Card.Title className="cardTitle">Sales Projection</Card.Title>
                <Card.Text>
                  <div className="salesGraphDiv">
                    <SalesGraph />
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
            {/* Display the top sellers chart */}
            <Card className="containerCard" id="topSellerCard">
              <Card.Body>
                <Card.Title className="cardTitle">Top Sellers</Card.Title>
                <Card.Text>
                  <div className="salesGraphDiv">
                    <TopSellersChart />
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col  sm={4}>
            <div className="reportGenerationDiv">
              <h3>Generate Reports</h3>
              {/* Display the inventory report card */}
              <Card style={{ width: "100%" }} className="inventoryReportCard">
                <Card.Body>
                  <Card.Title>Inventory Report</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    As at {new Date().toDateString()}
                  </Card.Subtitle>
                  <Card.Text>
                    Inventory report will show you the current status of your
                    inventory.
                  </Card.Text>

                  <div className="reportButtonDiv">
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={handleGenerateInvReport}
                    >
                      Generate Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              {/* Display the sales report card */}
              <Card style={{ width: "100%" }} className="salesReportCard">
                <Card.Body>
                  <Card.Title>Sales Report</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Keep minimum 3 months gap.
                  </Card.Subtitle>
                  <Card.Text>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                      <DemoContainer components={["DatePicker", "DatePicker"]}>
                        <DatePicker
                          label="From Date"
                          value={fromDate}
                          onChange={(newValue) => setFromDate(newValue)}
                          
                        />
                        <DatePicker
                          label="To Date"
                          value={toDate}
                          onChange={(newValue) => setToDate(newValue)}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Card.Text>

                  <div className="reportButtonDiv">
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={handleGenerateSalesReport}
                    >
                      Generate Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      {/* Confirmation modal */}
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Start downloading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please wait report will start downloding shortly!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Reports;
