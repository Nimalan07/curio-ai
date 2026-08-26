import html2canvas from "html2canvas";


export default function ReportDownload({
  reportRef
}) {

  const downloadReport = async () => {

    if (!reportRef.current) {
      return;
    }

    const canvas =
      await html2canvas(
        reportRef.current,
        {
          scale: 2,
          backgroundColor: "#FFFFFF"
        }
      );

    const link =
      document.createElement("a");

    link.download =
      "curio-understanding-report.png";

    link.href =
      canvas.toDataURL("image/png");

    link.click();
  };


  return (
    <button
      className="download-button"
      onClick={downloadReport}
    >
      ↓ Download Report
    </button>
  );
}
