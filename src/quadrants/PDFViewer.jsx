import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

function PDFViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <div style={styles.container}>
      <Document
        file="/sample.pdf"
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Page pageNumber={pageNumber} width={350} />
      </Document>

      <div style={styles.controls}>
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          Prev
        </button>

        <span>
          {pageNumber} / {numPages}
        </span>

        <button
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100%",
    overflow: "auto",
    textAlign: "center",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "8px",
  },
};

export default PDFViewer;
