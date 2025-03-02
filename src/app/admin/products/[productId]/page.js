"use client";
import Alert from "@/app/components/alert";
import getReq from "@/app/utilities/getReq";
import postReq from "@/app/utilities/postReq";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

const Page = () => {
  let { productId } = useParams();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [product, setProduct] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  useEffect(() => {
    if (product?.product?.images) {
      setExistingImages(product.product.images.map((img) => img.url));
    }
  }, [product]);

  async function getAllCollections() {
    try {
      let result = await getReq(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getCollections`
      );
      setCollections(result.response.data);
    } catch (error) {
      console.log("Error in fetching all collections", error);
    }
  }
  async function getProductDetails() {
    let result = await postReq(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getSpecificProduct`,
      { productId }
    );
    setProduct(result.response);
    console.log(result.response);
  }
  useEffect(() => {
    getAllCollections();
    getProductDetails();
  }, []);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      descriptionPoints: [""],
      caringInstructions: [""],
      bestSizeForYou: [""],
    },
  });
  useEffect(() => {
    setValue("name", product.product?.name);
    setValue("price", product.product?.price);
    setValue(
      "sizes",
      product.product?.sizes.map((size) => size)
    );
    setValue(
      "colors",
      product.product?.colors.map((color) => color)
    );
    setValue("youtubeVideo", product.product?.youtubeVideo);
    setValue("materials", product.product?.materials);
    setValue("descriptionPoints", product.product?.descriptionPoints);
    setValue("caringInstructions", product.product?.caringInstructions);
    setValue("bestSizeForYou", product.product?.usageInstructions);
  }, [product, setValue]);
  const onSubmit = async (data) => {
    setLoading(true);
    setApiResponse("");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("sizes", data.sizes.join(","));
      formData.append("colors", data.colors.join(","));
      formData.append("materials", data.materials);
      formData.append(
        "descriptionPoints",
        JSON.stringify(data.descriptionPoints)
      );
      formData.append(
        "caringInstructions",
        JSON.stringify(data.caringInstructions)
      );
      formData.append("usageInstructions", JSON.stringify(data.bestSizeForYou));
      formData.append("youtubeVideo", data.youtubeVideo);
      formData.append("parentCollection", data.parentCollection);

      // Append images user wants to keep
      formData.append("existingImages", JSON.stringify(existingImages));

      // Append new image files
      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      // Send request
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/updateProduct`,
        {
          method: "POST",
          body: formData,
        }
      );

      let result = await response.json();

      setApiResponse(result.message);
      setLoading(false);
      getProductDetails();
    } catch (error) {
      console.error("Error updating product:", error);
      setApiResponse("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setValue("files", files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };
  return (
    <main className="min-h-screen flex-col w-screen  items-center p-6">
      <Alert message={apiResponse} />
      <div className="flex gap-3 my-3 flex-wrap">
        {existingImages.map((imageUrl) => (
          <div key={imageUrl} className="relative">
            <img
              src={imageUrl}
              className="h-[10vh] sm:h-[15vh] md:h-[25vh] w-auto"
            />
            <button
              onClick={() =>
                setExistingImages(
                  existingImages.filter((img) => img !== imageUrl)
                )
              }
              className="absolute cursor-pointer top-1 right-1 bg-red-600 text-white p-1 rounded"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-black text-white max-w-lg w-full  shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>

        <InputField
          label="Product Name"
          name="name"
          register={register}
          errors={errors}
          required
        />
        <InputField
          label="Price"
          name="price"
          register={register}
          errors={errors}
          required
          type="number"
        />
        <InputField
          label="Sizes (Comma Separated)"
          name="sizes"
          register={register}
          errors={errors}
          required
        />
        <InputField
          label="Colors (Comma Separated)"
          name="colors"
          register={register}
          errors={errors}
          required
        />
        <InputField
          label="Material"
          name="materials"
          register={register}
          errors={errors}
          required
        />

        {/* Collection Dropdown */}
        <select
          {...register("parentCollection", {
            required: "Please select a collection",
          })}
          className="p-2 w-full bg-gray-800 border border-gray-700"
        >
          <option value={product.collection?._id}>
            {product.collection?.name}
          </option>
          {collections.map(({ _id, name }) => (
            <option key={_id} value={_id}>
              {name}
            </option>
          ))}
        </select>
        {errors.parentCollection && (
          <p className="text-red-500 text-xs mt-1">
            {errors.parentCollection.message}
          </p>
        )}

        <InputField
          label="YouTube Video URL (Optional)"
          name="youtubeVideo"
          register={register}
          errors={errors}
          pattern={/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/}
        />

        {/* File Upload */}
        <div className="">
          <label className="text-sm font-medium">
            Upload Images Click Here
          </label>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="input-field border"
            onChange={handleFileChange}
          />
          {previewImages.length > 0 &&
            previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                className="w-full h-32 object-cover rounded mt-2"
              />
            ))}
        </div>

        {/* Multi-Point Sections */}
        <MultiPointSection
          title="Product Description"
          name="descriptionPoints"
          control={control}
          setValue={setValue}
          watch={watch}
        />
        <MultiPointSection
          title="Caring Instructions"
          name="caringInstructions"
          control={control}
          setValue={setValue}
          watch={watch}
        />
        <MultiPointSection
          title="Best Size For You"
          name="bestSizeForYou"
          control={control}
          setValue={setValue}
          watch={watch}
        />

        <button
          type="submit"
          className="w-full p-2 cursor-pointer bg-white text-black rounded font-semibold mt-4"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
};

// ✅ Reusable Input Field Component
function InputField({
  label,
  name,
  register,
  errors,
  required,
  type = "text",
  pattern,
}) {
  return (
    <div className="mb-3">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        {...register(name, {
          required: required && `${label} is required`,
          pattern,
        })}
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
}

// ✅ Multi-Point Input Component
function MultiPointSection({ title, name, control, setValue, watch }) {
  const points = watch(name) || [];

  return (
    <div className="bg-gray-800 p-3 rounded mt-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {points.map((point, index) => (
        <div key={index} className="flex items-center gap-2 mt-2">
          <Controller
            control={control}
            name={`${name}[${index}]`}
            render={({ field }) => (
              <input
                {...field}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              />
            )}
          />
          <button
            type="button"
            onClick={() =>
              setValue(
                name,
                points.filter((_, i) => i !== index)
              )
            }
            className="p-2 bg-red-600 text-white rounded"
          >
            ✖
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setValue(name, [...points, ""])}
        className="mt-2 p-2 bg-green-600 text-white rounded"
      >
        + Add Point
      </button>
    </div>
  );
}

export default Page;
