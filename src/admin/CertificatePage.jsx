import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import certificateImg from './images/certificate.png';

export default function CertificatePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`http://localhost:5000/api/certificates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else {
          console.error("Failed to fetch certificate:", result.message);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchCertificate();
  }, [id]);

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=1200,height=800");

    const certificateHTML = `
      <div id="print-area" style="
        width: 100vw;
        height: 100vh;
        background-image: url('${certificateImg}');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        position: relative;
        box-sizing: border-box;
          padding: 20px;
      ">
        <div style="position: absolute; top: 257px; left: 400px; font-size: 22px; font-weight: bold; font-family: 'Arial Narrow Bold'">${data.name}</div>

        <div style="position: absolute; top: 344px; left: 500px; font-size: 22px; font-weight: bold;">${data.father_name}</div>

        <div style="position: absolute; top: 341px; right: 165px; font-size: 22px; font-weight: bold;">${data.duration}</div>

        <div style="position: absolute; bottom: 206px; left: 435px; font-size: 22px; font-weight: bold" }}>${data.grade}</div>

        <div style="position: absolute; bottom: 179px; left: 300px; font-size: 22px; font-weight: bold;">${data.regNo || id}MBD/11907</div>

        <div style="position: absolute; bottom: 179px; right: 95px; font-size: 22px; font-weight: bold;">${new Date(data.issue_date).toLocaleDateString("en-GB")}</div>
      </div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Certificate</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            #print-area {
              width: 100vw;
              height: 100vh;
              background: white;
            }
          </style>
        </head>
        <body>
          ${certificateHTML}
          <script>
            window.onload = function () {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
  };

  if (!data) {
    return <p className="text-center mt-10 text-gray-600">Loading certificate...</p>;
  }

  return (
    <div className="p-4">
      <div className="mt-6 absolute right-[180px] bottom-[100px]">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print Certificate
        </button>
      </div>
      <div
        id="print-area"
        style={{
          width: "100%",
          maxWidth: "840px",
          margin: "0 auto",
          backgroundImage: `url('${certificateImg}')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          position: "relative",
          height: "600px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ position: "absolute", top: "257px", left: "400px", fontSize: "16px", fontWeight: "bold" }}>{data.name}</div>
        <div style={{ position: "absolute", top: "285px", left: "230px", fontSize: "16px", fontWeight: "bold" }}>{data.father_name}</div>
        {/* <div style={{ position: "absolute", top: "145px", left: "80px", fontSize: "16px", fontWeight: "bold" }}>{data.center || "CEC COMPUTER CENTER DHAMPUR"}</div> */}
        <div style={{ position: "absolute", top: "341px", right: "165px", fontSize: "16px", fontWeight: "bold" }}>{data.duration}</div>
        <div style={{ position: "absolute", bottom: "206px", left: "435px", fontSize: "16px", fontWeight: "bold" }}>{data.grade}</div>
        <div style={{ position: "absolute", bottom: "179px", left: "300px", fontSize: "16px", fontWeight: "bold" }}>{data.regNo || id}MBD/11907</div>
        <div style={{ position: "absolute", bottom: "179px", right: "95px", fontSize: "16px", fontWeight: "bold" }}>{new Date(data.issue_date).toLocaleDateString("en-GB")}</div>
      </div>
    </div>
  );
}
