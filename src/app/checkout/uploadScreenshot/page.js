"use client";
import Alert from "@/app/components/alert";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function ImageUploadFormContent() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const accountHolderName = "MUHAMMAD ARIF";
  const accountNumber = "14810104168785";
  const IBAN = "PK87MEZN0014810104168785";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("orderId", orderId);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/addPayment`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setLoading(false);
    setApiResponse(data.message);
    window.alert("Take Screenshot Of Your Order Id: ", orderId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Alert message={apiResponse} />
      <div className="p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-lg font-bold mb-2 text-center">
          Account Holder Name : {accountHolderName}
        </h2>
        <h2 className="text-lg font-bold mb-2 text-center">
          Account Number : {accountNumber}
        </h2>
        <h2 className="text-lg font-bold mb-2 text-center">IBAN : {IBAN}</h2>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Transfer Amount In Given Account And
        </h2>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Upload Screenshot Here
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border border-gray-700 p-4 rounded-lg flex flex-col items-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full mb-3"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black cursor-pointer text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Uploading" : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ImageUploadForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImageUploadFormContent />
    </Suspense>
  );
}
