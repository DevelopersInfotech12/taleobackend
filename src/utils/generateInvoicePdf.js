import PDFDocument from "pdfkit";

// Brand
const BRAND_NAME = "Taleo";
const BRAND_TAGLINE = "Fine Jewellery";
const BRAND_EMAIL = "taleojewels@gmail.com";

const GOLD = "#b08850";
const BROWN = "#3d1f10";
const TEXT = "#2a1a0e";
const MUTED = "#7a6548";
const BORDER = "#e5dbc9";
const CREAM = "#f5efe8";

const fmtINR = (n) =>
  `Rs. ${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "-";

/**
 * Streams a PDF invoice for the given order directly to the response.
 * @param {import('mongoose').Document} order - populated Order document
 * @param {import('express').Response} res
 */
export function streamInvoicePdf(order, res) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="Invoice-${order.orderNumber}.pdf"`
  );

  doc.pipe(res);

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const left = doc.page.margins.left;

  // ── Header ──────────────────────────────────────────
  doc
    .fillColor(BROWN)
    .font("Helvetica-Bold")
    .fontSize(22)
    .text(BRAND_NAME, left, 50);
  doc
    .fillColor(GOLD)
    .font("Helvetica")
    .fontSize(9)
    .text(BRAND_TAGLINE.toUpperCase(), left, 76, { characterSpacing: 1.5 });
  doc.fillColor(MUTED).fontSize(9).text(BRAND_EMAIL, left, 92);

  doc
    .fillColor(TEXT)
    .font("Helvetica-Bold")
    .fontSize(18)
    .text("INVOICE", left, 50, { width: pageWidth, align: "right" });
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(MUTED)
    .text(`Invoice No: ${order.orderNumber}`, left, 76, { width: pageWidth, align: "right" })
    .text(`Date: ${fmtDate(order.updatedAt || order.createdAt)}`, left, 90, {
      width: pageWidth,
      align: "right",
    });

  doc.moveTo(left, 115).lineTo(left + pageWidth, 115).strokeColor(BORDER).stroke();

  // ── Bill to / Ship to ──────────────────────────────
  const billTop = 132;
  const colWidth = pageWidth / 2 - 10;

  doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(9).text("BILLED TO", left, billTop, { characterSpacing: 1 });
  doc
    .fillColor(TEXT)
    .font("Helvetica")
    .fontSize(10)
    .text(order.shippingAddress?.name || order.user?.name || "-", left, billTop + 16, { width: colWidth })
    .text(order.user?.email || "", left, doc.y + 2, { width: colWidth })
    .text(order.shippingAddress?.phone || order.user?.phone || "", left, doc.y + 2, { width: colWidth });

  const shipLeft = left + colWidth + 20;
  doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(9).text("SHIP TO", shipLeft, billTop, { characterSpacing: 1 });
  const addr = order.shippingAddress || {};
  const addrLines = [addr.line1, addr.line2, [addr.city, addr.state].filter(Boolean).join(", "), [addr.pincode, addr.country].filter(Boolean).join(", ")].filter(Boolean);
  doc.fillColor(TEXT).font("Helvetica").fontSize(10).text(addrLines.join("\n") || "-", shipLeft, billTop + 16, { width: colWidth });

  // ── Order meta strip ───────────────────────────────
  const metaTop = Math.max(doc.y, billTop + 90) + 14;
  doc.roundedRect(left, metaTop, pageWidth, 44, 6).fillAndStroke(CREAM, BORDER);
  const metaColW = pageWidth / 3;
  const metaItems = [
    ["Order Status", (order.status || "-").toUpperCase()],
    ["Payment Method", order.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid (Online)"],
    ["Payment Status", (order.paymentStatus || "-").toUpperCase()],
  ];
  metaItems.forEach(([label, val], i) => {
    const x = left + i * metaColW + 14;
    doc.fillColor(MUTED).font("Helvetica").fontSize(8).text(label.toUpperCase(), x, metaTop + 8, { characterSpacing: 0.5 });
    doc.fillColor(TEXT).font("Helvetica-Bold").fontSize(10).text(val, x, metaTop + 21);
  });

  // ── Items table ────────────────────────────────────
  let tableTop = metaTop + 44 + 24;
  const cols = {
    item: left,
    qty: left + pageWidth - 220,
    price: left + pageWidth - 155,
    total: left + pageWidth - 70,
  };
  const colEnd = left + pageWidth;

  const drawTableHeader = (y) => {
    doc.rect(left, y, pageWidth, 24).fill(BROWN);
    doc.fillColor("#f5efe8").font("Helvetica-Bold").fontSize(9);
    doc.text("ITEM", cols.item + 10, y + 7);
    doc.text("QTY", cols.qty, y + 7, { width: 45, align: "right" });
    doc.text("PRICE", cols.price, y + 7, { width: 60, align: "right" });
    doc.text("TOTAL", cols.total, y + 7, { width: colEnd - cols.total - 10, align: "right" });
    return y + 24;
  };

  tableTop = drawTableHeader(tableTop);

  const items = order.items || [];
  doc.font("Helvetica").fontSize(9.5).fillColor(TEXT);

  items.forEach((it, idx) => {
    const rowHeight = 26;
    if (tableTop + rowHeight > doc.page.height - doc.page.margins.bottom - 160) {
      doc.addPage();
      tableTop = drawTableHeader(50);
    }
    if (idx % 2 === 1) {
      doc.rect(left, tableTop, pageWidth, rowHeight).fill(CREAM);
      doc.fillColor(TEXT);
    }
    const name = it.variantLabel ? `${it.name} (${it.variantLabel})` : it.name;
    doc.font("Helvetica").fontSize(9.5).fillColor(TEXT);
    doc.text(name, cols.item + 10, tableTop + 8, { width: cols.qty - cols.item - 15 });
    doc.text(String(it.quantity), cols.qty, tableTop + 8, { width: 45, align: "right" });
    doc.text(fmtINR(it.price), cols.price, tableTop + 8, { width: 60, align: "right" });
    doc.text(fmtINR(it.price * it.quantity), cols.total, tableTop + 8, {
      width: colEnd - cols.total - 10,
      align: "right",
    });
    tableTop += rowHeight;
  });

  doc.moveTo(left, tableTop).lineTo(colEnd, tableTop).strokeColor(BORDER).stroke();

  // ── Totals ─────────────────────────────────────────
  let sumY = tableTop + 14;
  const sumLabelX = colEnd - 220;
  const sumValW = 150;

  const sumRow = (label, val, bold = false) => {
    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(bold ? 12 : 10)
      .fillColor(bold ? TEXT : MUTED)
      .text(label, sumLabelX, sumY, { width: 70 });
    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(bold ? 12 : 10)
      .fillColor(TEXT)
      .text(val, colEnd - sumValW, sumY, { width: sumValW, align: "right" });
    sumY += bold ? 22 : 18;
  };

  sumRow("Subtotal", fmtINR(order.subtotal));
  if (order.discount) sumRow("Discount", `- ${fmtINR(order.discount)}`);
  sumRow("Shipping", order.shippingCharge ? fmtINR(order.shippingCharge) : "Free");
  doc.moveTo(sumLabelX, sumY).lineTo(colEnd, sumY).strokeColor(BORDER).stroke();
  sumY += 8;
  sumRow("Total", fmtINR(order.total), true);

  // ── Footer ─────────────────────────────────────────
  const footerY = doc.page.height - 90;
  doc
    .moveTo(left, footerY)
    .lineTo(left + pageWidth, footerY)
    .strokeColor(BORDER)
    .stroke();
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(MUTED)
    .text(
      `Thank you for shopping with ${BRAND_NAME}. This is a system-generated invoice and does not require a signature.`,
      left,
      footerY + 10,
      { width: pageWidth, align: "center", lineBreak: false }
    )
    .text(`For queries, write to ${BRAND_EMAIL}`, left, footerY + 24, {
      width: pageWidth,
      align: "center",
      lineBreak: false,
    });

  doc.end();
}
