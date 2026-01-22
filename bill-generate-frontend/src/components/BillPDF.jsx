import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    position: "relative", // Added for proper footer positioning
  },
  
  // Main content container - with bottom margin for footer
  mainContent: {
    paddingBottom: 120, // Space for footer at the bottom
  },
  
  // Top Grey Header with Logo - REMOVED WHITE BOX BEHIND LOGO
  headerContainer: {
    backgroundColor: "#374151", // Dark gray background
    padding: 25,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoColumn: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff", // White text
    marginBottom: 2,
  },
  companyTagline: {
    fontSize: 9,
    color: "#d1d5db", // Light gray text
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contactItem: {
    fontSize: 9,
    color: "#d1d5db", // Light gray text
    marginBottom: 2,
    marginRight: 8,
  },
  
  // Invoice Header
  invoiceHeader: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", // White text
    marginBottom: 4,
  },
  invoiceBadge: {
    backgroundColor: "#3b82f6", // Blue badge
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 8,
    fontWeight: "bold",
  },
  invoiceDetails: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  invoiceDetail: {
    fontSize: 9,
    color: "#d1d5db", // Light gray text
    marginBottom: 2,
  },
  
  // Two Column Layout - Only Customer Info
  twoColumn: {
    flexDirection: "row",
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  column: {
    flex: 1,
  },
  
  // Customer Info - Now taking full width
  customerCard: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
    alignItems: "flex-start",
  },
  customerTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
    textAlign: "left",
  },
  customerDetail: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 2,
    textAlign: "left",
  },
  
  // Paid Status Badge
  statusBadgeContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 9,
    fontWeight: "bold",
  },
  paidBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  unpaidBadge: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  
  // Items Table
  itemsSection: {
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  table: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#374151", // Dark gray header
    padding: 8,
  },
  tableHeaderText: {
    color: "#ffffff", // White text
    fontWeight: "bold",
    fontSize: 9,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#f8fafc",
  },
  colService: { width: "45%", paddingRight: 5 },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "20%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },
  
  // Totals - Simplified
  totalsSection: {
    paddingHorizontal: 25,
    marginBottom: 15,
    alignItems: "flex-end",
  },
  totalsBox: {
    width: 200,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#374151", // Dark gray background
  },
  totalLabel: {
    fontSize: 11,
    color: "#475569",
  },
  totalValue: {
    fontSize: 11,
    color: "#1e293b",
    fontWeight: "bold",
  },
  grandTotalLabel: {
    fontSize: 12,
    color: "#ffffff", // White text
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 12,
    color: "#ffffff", // White text
    fontWeight: "bold",
  },
  
  // Payment Details
  paymentSection: {
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  paymentGrid: {
    flexDirection: "row",
    marginTop: 8,
  },
  paymentColumn: {
    flex: 1,
  },
  paymentCard: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  bankName: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 11,
    color: "#1e40af",
    fontWeight: "bold",
    marginBottom: 2,
  },
  accountHolder: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 2,
  },
  branch: {
    fontSize: 9,
    color: "#64748b",
  },
  
  // Fixed Footer at the bottom
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: "#374151", // Dark gray background
    borderTopWidth: 1,
    borderTopColor: "#4b5563",
  },
  thankYou: {
    textAlign: "center",
    marginBottom: 8,
  },
  thankYouText: {
    fontSize: 12,
    color: "#ffffff", // White text
    fontWeight: "bold",
    marginBottom: 3,
  },
  thankYouSubtext: {
    fontSize: 10,
    color: "#d1d5db", // Light gray text
  },
  footerContact: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  footerContactItem: {
    fontSize: 9,
    color: "#d1d5db", // Light gray text
    marginRight: 8,
  },
  footerCopyright: {
    fontSize: 9,
    color: "#9ca3af", // Medium gray text
    textAlign: "center",
  },
});

// PDF Document Component
const BillDocument = ({ bill }) => {
  const items = bill.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
    0
  );

  const logoSrc = "/LOGO.png";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Main Content Container - ensures footer space */}
        <View style={styles.mainContent}>
          {/* Dark Gray Header with Logo and Company Info - LOGO WITHOUT WHITE BOX */}
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <View style={styles.logoColumn}>
                {/* Logo now sits directly on gray background without white box */}
                <Image src={logoSrc} style={styles.logoImage} />
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>ABC Graphics</Text>
                  <Text style={styles.companyTagline}>Creativity Beyond Limits!</Text>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactItem}>Polonnaruwa</Text>
                    <Text style={styles.contactItem}>•</Text>
                    <Text style={styles.contactItem}>www.abcgraphics.lk</Text>
                    <Text style={styles.contactItem}>•</Text>
                    <Text style={styles.contactItem}>071 523 4993</Text>
                  </View>
                  <Text style={styles.contactItem}>abceditinggraphic@gmail.com</Text>
                </View>
              </View>
              
              <View style={styles.invoiceHeader}>
                <Text style={styles.invoiceTitle}>INVOICE</Text>
                <Text style={styles.invoiceBadge}>#{bill.bill_number}</Text>
                <View style={styles.invoiceDetails}>
                  <Text style={styles.invoiceDetail}>Date: {bill.date}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Customer Info - Full Width */}
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.customerTitle}>BILL TO</Text>
              <View style={styles.customerCard}>
                <Text style={styles.customerName}>{bill.customer_name}</Text>
                {bill.customer_email && (
                  <Text style={styles.customerDetail}> {bill.customer_email}</Text>
                )}
                {bill.customer_phone && (
                  <Text style={styles.customerDetail}> {bill.customer_phone}</Text>
                )}
                {bill.customer_address && (
                  <Text style={styles.customerDetail}> {bill.customer_address}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Paid Status Badge */}
          {bill.is_paid && (
            <View style={styles.statusBadgeContainer}>
              <View style={[styles.statusBadge, styles.paidBadge]}>
                <Text>PAID</Text>
              </View>
            </View>
          )}

          {/* Items Table */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>SERVICES / ITEMS</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.colService]}>Description</Text>
                <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
                <Text style={[styles.tableHeaderText, styles.colPrice]}>Unit Price</Text>
                <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
              </View>

              {items.map((item, index) => (
                <View
                  key={index}
                  style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                >
                  <Text style={styles.colService}>{item.service_name}</Text>
                  <Text style={styles.colQty}>{item.quantity}</Text>
                  <Text style={styles.colPrice}>Rs. {Number(item.unit_price).toFixed(2)}</Text>
                  <Text style={styles.colAmount}>
                    Rs. {(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Totals - Simplified (No Tax or Discount) */}
          <View style={styles.totalsSection}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>Rs. {subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>TOTAL AMOUNT</Text>
                <Text style={styles.grandTotalValue}>Rs. {Number(bill.total).toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Payment Details */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>PAYMENT METHODS</Text>
            <View style={styles.paymentGrid}>
              <View style={styles.paymentColumn}>
                <View style={styles.paymentCard}>
                  <Text style={styles.bankName}>BANK OF CEYLON</Text>
                  <Text style={styles.accountNumber}>92339910</Text>
                  <Text style={styles.accountHolder}>H.K.B.S.Rathanasiri</Text>
                  <Text style={styles.branch}>Kaduruwela Branch</Text>
                </View>
              </View>
              
              <View style={styles.paymentColumn}>
                <View style={styles.paymentCard}>
                  <Text style={styles.bankName}>PEOPLES BANK</Text>
                  <Text style={styles.accountNumber}>005200170090177</Text>
                  <Text style={styles.accountHolder}>H.K.B.S.Rathnasiri</Text>
                  <Text style={styles.branch}>Polonnaruwa Branch</Text>
                </View>
              </View>
              
              <View style={styles.paymentColumn}>
                <View style={styles.paymentCard}>
                  <Text style={styles.bankName}>NDB BANK</Text>
                  <Text style={styles.accountNumber}>115511917281</Text>
                  <Text style={styles.accountHolder}>H.K.B.S.Rathnasiri</Text>
                  <Text style={styles.branch}>Boralasgamuwa Branch</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.customerDetail, { marginTop: 8 }]}>
              * Please send the payment slip to us after payment
            </Text>
          </View>
        </View>

        {/* Fixed Footer at bottom of page */}
        <View style={styles.footer}>
          <View style={styles.thankYou}>
            <Text style={styles.thankYouText}>Thank you for choosing ABC Graphics!</Text>
            <Text style={styles.thankYouSubtext}>
              We appreciate your business and look forward to serving you again
            </Text>
          </View>
          
          <View style={styles.footerContact}>
            <Text style={styles.footerContactItem}> 075 971 5913 (Call)</Text>
            <Text style={styles.footerContactItem}>•</Text>
            <Text style={styles.footerContactItem}> 071 523 4993 (WhatsApp)</Text>
            <Text style={styles.footerContactItem}>•</Text>
            <Text style={styles.footerContactItem}> www.abcgraphics.lk</Text>
          </View>
          
          <Text style={styles.footerCopyright}>
            © {new Date().getFullYear()} ABC Graphics. All rights reserved.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Preview Modal Component - Using iframe for better compatibility
const BillPDFModal = ({ bill, isOpen, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && bill) {
      setLoading(true);
      setPdfUrl(null);
      
      // Generate PDF blob and create URL
      const generatePdf = async () => {
        try {
          const blob = await pdf(<BillDocument bill={bill} />).toBlob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } catch (error) {
          console.error("Error generating PDF:", error);
        } finally {
          setLoading(false);
        }
      };
      
      generatePdf();
      
      // Cleanup URL on unmount
      return () => {
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
      };
    }
  }, [isOpen, bill]);

  if (!isOpen || !bill) return null;

  const handleDownload = async () => {
    const blob = await pdf(<BillDocument bill={bill} />).toBlob();
    saveAs(blob, `Invoice-${bill.bill_number}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="flex flex-col w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
          <div>
            <p className="text-sm uppercase tracking-wider text-slate-300">Invoice Preview</p>
            <h2 className="text-xl font-semibold">#{bill.bill_number}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </button>
            <button
              className="text-3xl leading-none text-slate-300 transition-transform duration-300 hover:rotate-90 hover:text-white"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* PDF Viewer - Using iframe */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium">Generating PDF...</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Invoice PDF"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 p-8">
              <div className="text-red-500 text-6xl">⚠️</div>
              <p className="text-slate-600 font-medium">Failed to load PDF preview</p>
              <button
                onClick={handleDownload}
                className="mt-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
              >
                Download PDF Instead
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { BillDocument, BillPDFModal };
export default BillPDFModal;