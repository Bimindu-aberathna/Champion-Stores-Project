import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";

export default function PastOrderModel({order}) {
  const [scrollableModal, setScrollableModal] = useState(false);

  return (
    <>
      <MDBBtn color='dark' onClick={() => setScrollableModal(!scrollableModal)}>{/*Button to open modal*/}
        View
      </MDBBtn>

      <MDBModal
        open={scrollableModal}
        onClose={() => setScrollableModal(false)}
        tabIndex="-1"
      >
        <MDBModalDialog scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Order</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setScrollableModal(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>{/*Modal body to display order details*/}
              <p>Date: {order.dateTime}</p>
              <p>Order ID: {order.cartID}</p>
              <p>Order Status: {order.deliveryStatus===0?"Processing":"Delivered"}</p>
              <p>Receiver: {order.receiverName}</p>
              <p>Receiver Phone: {order.receiverTelephone}</p>
              <p>Reveiver Address: {order.deliveryAddress}</p>
              <p>Total: Rs. {order.totalAmount}.00</p>
              <p>Items:</p>
              <div>
                <MDBListGroup light numbered style={{ minWidth: "22rem" }}>
                  {order.items.map((item) => (//map through items in the order
                    <MDBListGroupItem className="d-flex justify-content-between align-items-start" key={item.cart_itemID}>
                      <div className="ms-2 me-auto">
                        <div className="fw-bold" style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{item.productName}</div>Rs. {item.unitPrice} x {item.quantity} = Rs. {item.totalAmount}
                      </div>
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn //button to close the modal
                color="dark"
                onClick={() => setScrollableModal(!setScrollableModal)}
              >
                Close
              </MDBBtn>
              
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
