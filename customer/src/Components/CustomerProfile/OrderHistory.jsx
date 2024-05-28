import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBListGroup,
  MDBListGroupItem,
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { FaCircleUser } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOrderHistory } from "../Services/userServices";
import { TbTruckDelivery } from "react-icons/tb";
import PastOrderModel from "./PastOrderModal";
import "./CustomerProfile.css";
import "./OrderHistory.css";

function OrderHistory({customerName, customerEmail}) {
  const [enableEdit, setEnableEdit] = useState(false);//state for enable edit
  const [orderHistory, setOrderHistory] = useState([]);//state for order history
  useEffect(() => { //use effect to fetch order history
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => { //function to fetch order history
    try {
      const response = await getOrderHistory(); //get order history
      setOrderHistory(response.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow>
        <MDBCol col="10" md="6">
          <h1 className="text-center">Customer Profile</h1>
          <div>
            <div className="d-flex justify-content-center">
              <FaCircleUser size="8em" />
            </div>
            <br />
            <div className="d-flex justify-content-center">
              <h4>{customerName}</h4>
            </div>
            <div className="d-flex justify-content-center">{customerEmail}</div>
          </div>
        </MDBCol>

        <MDBCol col="4" md="6">
          <div>
            <div>
              <h1>Order History</h1>
            </div>
            {/* Display Order History */}
            <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <MDBTable>
                <MDBTableHead>
                  <tr>{/* Table Headers */}
                    <th scope="col">
                      <p
                        className="tblHeaders"
                        style={{ width: "100%", textAlign: "center" }}
                      >
                        Order Date
                      </p>
                    </th>
                    <th scope="col">
                      <p
                        className="tblHeaders"
                        style={{ width: "100%", textAlign: "center" }}
                      >
                        Status
                      </p>
                    </th>
                    <th scope="col">
                      <p
                        className="tblHeaders"
                        style={{ width: "100%", textAlign: "center" }}
                      >
                        Total
                      </p>
                    </th>
                    <th scope="col">
                      <p
                        className="tblHeaders"
                        style={{ width: "100%", textAlign: "center" }}
                      >
                        {" "}
                      </p>
                    </th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>{/* Table Body */}
                  {orderHistory.map((order) => (//map through order history
                    <tr style={{ cursor: "pointer" }}>
                      <td>
                        <p className="tblBody">{order.dateTime}</p>{/* Order Date */}
                      </td>
                      <td>
                        <div>
                          {order.deliveryStatus === 0 ? (//if the order is not delivered
                            <div style={{ textAlign: "center" }}>
                              <MDBBadge color="success" pill>
                                Proccessing
                              </MDBBadge>
                            </div>
                          ) : (//if the order is delivered
                            <div style={{ textAlign: "center" }}>
                              <MDBBadge color="danger" pill>
                                Delivered
                              </MDBBadge>
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <p className="tblBody">{/* Total Amount */}
                          Rs.{order.totalAmount}.00 + <TbTruckDelivery />
                        </p>
                      </td>
                      <td>
                        <PastOrderModel //pass order to PastOrderModel
                          order={order}
                        />
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  );
}

export default OrderHistory;
