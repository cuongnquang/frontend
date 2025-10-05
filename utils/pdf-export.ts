import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const exportToPDFAdvanced = (
    data: any[],
    title: string,
    columns: string[],
    fileName: string
) => {
    const doc = new jsPDF()

    // Add logo/header
    doc.setFontSize(20)
    doc.setTextColor(37, 99, 235) // Blue color
    doc.text('YouMed', 14, 20)

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(title, 14, 35)

    // Add metadata
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, 14, 45)
    doc.text(`Tổng số bản ghi: ${data.length}`, 14, 52)

    // Add table
    autoTable(doc, {
        startY: 60,
        head: [columns],
        body: data.map(row => columns.map(col => row[col] || '')),
        theme: 'grid',
        headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        margin: { top: 60, left: 14, right: 14 },
        styles: {
            fontSize: 9,
            cellPadding: 3
        }
    })

    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text(
            `Trang ${i} / ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        )
    }

    doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`)
}