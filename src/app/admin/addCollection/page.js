"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import React from "react";
import Alert from "@/app/components/alert";

const Page = () => {
  const { register, handleSubmit, reset } = useForm();
  const [filePreview, setFilePreview] = useState(null);
  const [points, setPoints] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("file", data.file[0]);
    formData.append("descriptionPoints", JSON.stringify(points));
    if (!data.file || data.file.length === 0) {
      setApiResponse("Please upload an image or PDF.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/addCollection`,
        {
          method: "POST",
          body: formData, // ✅ FormData is now correctly formatted
        }
      );
      const responseData = await res.json();
      setApiResponse(responseData.message);
      setLoading(false);
      reset();
      setFilePreview(null);
      setPoints([""]);
    } catch (err) {
      setLoading(false);
      console.log("Error in adding collection", err);
      setApiResponse("Error in uploading file!");
    }
  };

  return (
    <main className="h-screen flex justify-center items-center">
      <Alert message={apiResponse} />
      <div className="p-6 bg-black text-white max-w-lg mx-auto rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add Collection</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Collection Name"
            {...register("name", { required: true })}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
          />
          {/* Image Upload */}
          <input
            type="file"
            accept="image/*,application/pdf"
            {...register("file", { required: true })}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              if (file.type === "application/pdf") {
                setFilePreview("/pdf-preview-icon.png"); // ✅ Static preview
              } else if (file.type.startsWith("image/")) {
                setFilePreview(URL.createObjectURL(file)); // ✅ Show actual image preview
              } else {
                setFilePreview(null);
              }
            }}
          />
          {filePreview && (
            <img
              src={filePreview}
              alt="Preview"
              className="mt-2 w-full h-32 object-cover rounded"
            />
          )}
          {/* Dynamic Description Points */}
          <div>
            <h3 className="mb-2">Description Points:</h3>
            {points.map((point, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => {
                    const newPoints = [...points];
                    newPoints[index] = e.target.value;
                    setPoints(newPoints);
                  }}
                  className="w-full p-2 rounded bg-gray-900 border border-gray-700"
                />
                {points.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPoints(points.filter((_, i) => i !== index))
                    }
                    className="text-red-500"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPoints([...points, ""])}
              className="p-2 bg-gray-800 rounded"
            >
              + Add Point
            </button>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-white text-black rounded font-semibold"
          >
            {loading ? "Submitting" : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;
