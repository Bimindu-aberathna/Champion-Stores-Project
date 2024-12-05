import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";


// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  receipt: {
    width: 300,
    backgroundColor: "#FFFFFF",
    padding: 20,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    fontFamily: "Helvetica",
    fontSize: 12,
  },
  section: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
    productData: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    },
  totals: {
    marginTop: 10,
    textAlign: "right",
    fontSize: 10,
  },
  tblHeader: {
    fontWeight: "bold",
    fontSize: 12,
    width:'20%',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    },
    tblHeaderItem: {
    fontWeight: "bold",
    width:'40%',
    fontSize: 12,
    },
    itemName: {
      width:'40%',
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical',
      maxHeight: 30,
    },
    itemContent: {
      fontSize: 10,
    },
    itemDetails: {
      width:'20%',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    
    },
    footer: {
      marginTop: 10,
      textAlign: "center",
      fontSize: 10,
      gap: 5,
    },
    storeName: {
      fontSize: 20,
      fontWeight: "bold",
    },
    storeInfo: {
      fontSize: 9,
    },
});

const MyDocument = ({ items, subtotal, discount, total }) => (//PDF document for the receipt
    <Document>
      <Page size={
        {width: 300}
      }  style={styles.page}>
        <View style={styles.receipt}>
          <View style={styles.header}>
            <Text style={styles.storeName}>Champion Stores</Text>
            <Text style={styles.storeInfo}>391 Mathugama road, Dharga Town.</Text>
            <Text style={styles.storeInfo}>Phone: 077 778 2487</Text>
            <Text style={styles.storeInfo}>Date: {new Date().toLocaleDateString()}</Text>
          </View>
          <Text>-------------------------------------</Text>
          <View style={styles.section}>
            {/*Table headers*/}
          <View style={styles.tblHeaderItem}><Text>Item</Text></View>
          <View style={styles.tblHeader}><Text>Qty</Text></View>  
           <View style={styles.tblHeader}> <Text>Units</Text></View>
           <View style={styles.tblHeader}><Text>Total</Text></View>
            </View>
            <View style={styles.itemContent}>
              {/**Table content */}
            {items.map((item, index) => (
              <View key={index} style={styles.productData}>
                <View style={styles.itemName}><Text>{item.name}</Text></View>
                <View style={styles.itemDetails}><Text>{item.quantity}</Text></View>
                <View style={styles.itemDetails}><Text>{item.price.toFixed(2)}</Text></View>
                <View style={styles.itemDetails}><Text>{(item.quantity * item.price).toFixed(2)}</Text></View>
              </View>
            ))}
          </View>
          {/* //Footer of the receipt */}
          <View style={styles.totals}>
            <Text>Subtotal: Rs.{subtotal.toFixed(2)}</Text>
            <Text>Discount: Rs.{discount}</Text>
            <Text style={{fontSize:'12' }}>Total: Rs.{total.toFixed(2)}</Text>
          </View>
          <Text>-------------------------------------</Text>
          <View style={styles.footer}>
            <Text>Thank you for shopping with us!</Text>
            <Text>Visit again soon!</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  function calculateTotal(items) {//Calculate the total of the receipt
    let total = 0;
    items.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  }

function Receipt({ items,discount}) {
  const subtotal = calculateTotal(items);//Calculate the subtotal of the receipt
  return (
    <div>
      <PDFViewer style={{width:"100%",minHeight:'50vh'}}>
        <MyDocument items={items} subtotal={subtotal} discount={discount} total={subtotal-discount} />
      </PDFViewer>
    </div>
  );
}

export default Receipt;
