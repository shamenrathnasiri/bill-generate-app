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

import LogoImageUrl from "../assets/LOGO.png";

let cachedLogoBase64 = null;

// PDF Styles — matching invoice format
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  mainContent: {
    paddingBottom: 120,
  },

  // Header
  headerContainer: {
    backgroundColor: "#374151",
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
    color: "#ffffff",
    marginBottom: 2,
  },
  companyTagline: {
    fontSize: 9,
    color: "#d1d5db",
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contactItem: {
    fontSize: 9,
    color: "#d1d5db",
    marginBottom: 2,
    marginRight: 8,
  },

  // Payment Header
  paymentHeader: {
    alignItems: "flex-end",
  },
  paymentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  paymentBadge: {
    backgroundColor: "#10b981",
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 8,
    fontWeight: "bold",
  },
  paymentDetails: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  paymentDetail: {
    fontSize: 9,
    color: "#d1d5db",
    marginBottom: 2,
  },

  // Info Section
  infoSection: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#f1f5f9",
    padding: 15,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 10,
    color: "#64748b",
    width: 120,
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 10,
    color: "#1e293b",
    flex: 1,
  },

  // Amount Section
  amountSection: {
    paddingHorizontal: 25,
    marginBottom: 20,
    alignItems: "flex-end",
  },
  amountBox: {
    width: 250,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#374151",
  },
  amountLabel: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },
  amountValue: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },

  // Description section
  descriptionSection: {
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
  descriptionText: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.6,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  // Notes section
  notesText: {
    fontSize: 9,
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 8,
    paddingHorizontal: 25,
  },

  // Bank Details (same as invoice)
  bankSection: {
    paddingHorizontal: 25,
    marginBottom: 15,
    marginTop: 10,
  },
  bankGrid: {
    flexDirection: "row",
    marginTop: 8,
  },
  bankColumn: {
    flex: 1,
  },
  bankCard: {
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

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: "#374151",
    borderTopWidth: 1,
    borderTopColor: "#4b5563",
  },
  thankYou: {
    textAlign: "center",
    marginBottom: 8,
  },
  thankYouText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 3,
  },
  thankYouSubtext: {
    fontSize: 10,
    color: "#d1d5db",
  },
  footerContact: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  footerContactItem: {
    fontSize: 9,
    color: "#d1d5db",
    marginRight: 8,
  },
  footerCopyright: {
    fontSize: 9,
    color: "#9ca3af",
    textAlign: "center",
  },
});

// Helper to convert logo to base64
const getBase64Logo = async (url) => {
  if (url && url.startsWith("data:")) {
    cachedLogoBase64 = url;
    return url;
  }
  if (cachedLogoBase64) return cachedLogoBase64;

  try {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL("image/png");
          cachedLogoBase64 = base64;
          resolve(base64);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => {
        fetch(url)
          .then((r) => r.blob())
          .then(
            (blob) =>
              new Promise((res, rej) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  cachedLogoBase64 = reader.result;
                  res(reader.result);
                };
                reader.onerror = rej;
                reader.readAsDataURL(blob);
              })
          )
          .then(resolve)
          .catch(reject);
      };
      img.src = url;
    });
  } catch {
    return null;
  }
};

// PDF Document Component
const PaymentDocument = ({ payment, logoBase64 }) => {
  const logoSrc = logoBase64 || LogoImageUrl;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainContent}>
          {/* Dark Gray Header */}
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <View style={styles.logoColumn}>
                <Image src={logoSrc} style={styles.logoImage} />
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>ABC Graphics</Text>
                  <Text style={styles.companyTagline}>
                    Creativity Beyond Limits!
                  </Text>
                  <View style={styles.contactRow}>
                    <Text style={styles.contactItem}>Polonnaruwa</Text>
                    <Text style={styles.contactItem}>•</Text>
                    <Text style={styles.contactItem}>www.abcgraphics.lk</Text>
                    <Text style={styles.contactItem}>•</Text>
                    <Text style={styles.contactItem}>071 523 4993</Text>
                  </View>
                  <Text style={styles.contactItem}>
                    info.abcgraphics@gmail.com
                  </Text>
                </View>
              </View>

              <View style={styles.paymentHeader}>
                <Text style={styles.paymentTitle}>PAYMENT SLIP</Text>
                <Text style={styles.paymentBadge}>
                  #{payment.payment_number}
                </Text>
                <View style={styles.paymentDetails}>
                  <Text style={styles.paymentDetail}>
                    Date: {payment.date}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Payment Info Card */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>PAYMENT DETAILS</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment To / From:</Text>
                <Text style={styles.infoValue}>{payment.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Date:</Text>
                <Text style={styles.infoValue}>{payment.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Method:</Text>
                <Text style={styles.infoValue}>
                  {payment.payment_method || "Cash"}
                </Text>
              </View>
              {payment.reference && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Reference:</Text>
                  <Text style={styles.infoValue}>{payment.reference}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Amount */}
          <View style={styles.amountSection}>
            <View style={styles.amountBox}>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>TOTAL AMOUNT</Text>
                <Text style={styles.amountValue}>
                  Rs. {Number(payment.amount).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {payment.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>DESCRIPTION</Text>
              <Text style={styles.descriptionText}>
                {payment.description}
              </Text>
            </View>
          )}

          {/* Notes */}
          {payment.notes && (
            <Text style={styles.notesText}>Note: {payment.notes}</Text>
          )}

          {/* Bank Details */}
          <View style={styles.bankSection}>
            <Text style={styles.sectionTitle}>BANK DETAILS</Text>
            <View style={styles.bankGrid}>
              <View style={styles.bankColumn}>
                <View style={styles.bankCard}>
                  <Text style={styles.bankName}>BANK OF CEYLON</Text>
                  <Text style={styles.accountNumber}>92339910</Text>
                  <Text style={styles.accountHolder}>
                    H.K.B.S.Rathanasiri
                  </Text>
                  <Text style={styles.branch}>Kaduruwela Branch</Text>
                </View>
              </View>
              <View style={styles.bankColumn}>
                <View style={styles.bankCard}>
                  <Text style={styles.bankName}>PEOPLES BANK</Text>
                  <Text style={styles.accountNumber}>005200170090177</Text>
                  <Text style={styles.accountHolder}>
                    H.K.B.S.Rathnasiri
                  </Text>
                  <Text style={styles.branch}>Polonnaruwa Branch</Text>
                </View>
              </View>
              <View style={styles.bankColumn}>
                <View style={styles.bankCard}>
                  <Text style={styles.bankName}>NDB BANK</Text>
                  <Text style={styles.accountNumber}>115511917281</Text>
                  <Text style={styles.accountHolder}>
                    H.K.B.S.Rathnasiri
                  </Text>
                  <Text style={styles.branch}>Boralasgamuwa Branch</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.thankYou}>
            <Text style={styles.thankYouText}>
              Thank you for choosing ABC Graphics!
            </Text>
            <Text style={styles.thankYouSubtext}>
              We appreciate your business and look forward to serving you again
            </Text>
          </View>
          <View style={styles.footerContact}>
            <Text style={styles.footerContactItem}>
              {" "}
              075 971 5913 (Call)
            </Text>
            <Text style={styles.footerContactItem}>•</Text>
            <Text style={styles.footerContactItem}>
              {" "}
              071 523 4993 (WhatsApp)
            </Text>
            <Text style={styles.footerContactItem}>•</Text>
            <Text style={styles.footerContactItem}>
              {" "}
              www.abcgraphics.lk
            </Text>
          </View>
          <Text style={styles.footerCopyright}>
            © {new Date().getFullYear()} ABC Graphics. All rights reserved.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Preview Modal Component
const PaymentPDFModal = ({ payment, isOpen, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoBase64, setLogoBase64] = useState(null);

  useEffect(() => {
    const loadLogo = async () => {
      if (LogoImageUrl.startsWith("data:")) {
        setLogoBase64(LogoImageUrl);
      } else {
        const base64 = await getBase64Logo(LogoImageUrl);
        setLogoBase64(base64 || LogoImageUrl);
      }
    };
    loadLogo();
  }, []);

  useEffect(() => {
    if (isOpen && payment && logoBase64) {
      setLoading(true);
      setPdfUrl(null);

      const generatePdf = async () => {
        try {
          const blob = await pdf(
            <PaymentDocument payment={payment} logoBase64={logoBase64} />
          ).toBlob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } catch (error) {
          console.error("Error generating payment PDF:", error);
        } finally {
          setLoading(false);
        }
      };

      generatePdf();

      return () => {
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
      };
    }
  }, [isOpen, payment, logoBase64]);

  if (!isOpen || !payment) return null;

  const handleDownload = async () => {
    let logo = logoBase64;
    if (!logo) {
      if (LogoImageUrl.startsWith("data:")) {
        logo = LogoImageUrl;
      } else {
        logo = await getBase64Logo(LogoImageUrl);
      }
    }
    const blob = await pdf(
      <PaymentDocument payment={payment} logoBase64={logo} />
    ).toBlob();
    saveAs(blob, `Payment-${payment.payment_number}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="flex flex-col w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
          <div>
            <p className="text-sm uppercase tracking-wider text-slate-300">
              Payment Slip Preview
            </p>
            <h2 className="text-xl font-semibold">
              #{payment.payment_number}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
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

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium">
                Generating PDF...
              </p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Payment Slip PDF"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 p-8">
              <div className="text-red-500 text-6xl">⚠️</div>
              <p className="text-slate-600 font-medium">
                Failed to load PDF preview
              </p>
              <button
                onClick={handleDownload}
                className="mt-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all"
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

export { PaymentDocument, PaymentPDFModal };
export default PaymentPDFModal;
