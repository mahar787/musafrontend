"use client";
import Alert from "@/app/components/alert";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

export default function AddProduct() {
  const [collections, setCollections] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getCollections`)
      .then((res) => res.json())
      .then((data) => setCollections(data.data || []))
      .catch(() => setApiResponse("Failed to load collections"));
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

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    const formData = new FormData();
    if (!data.files) {
      window.alert("Please Select At Least One Image");
    }
    if (data.files.length) {
      Array.from(data.files).forEach((file) => formData.append("files", file));
    }

    Object.entries(data).forEach(([key, value]) => {
      formData.append(
        key,
        Array.isArray(value) ? JSON.stringify(value) : value
      );
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/addProduct`,
        {
          method: "POST",
          body: formData,
        }
      );
      const responseData = await res.json();
      console.log(responseData);
      reset();
      window.alert(responseData.message);
      setApiResponse(responseData.message);
      setPreviewImages([]);
    } catch {
      setApiResponse("Error in uploading product!");
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
    <main className="min-h-screen flex justify-center items-center p-6">
      <Alert message={apiResponse} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-gray-900 text-white max-w-lg w-full rounded-lg shadow-lg"
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
          <option value="">Select Collection</option>
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
          className="w-full p-2 bg-white text-black rounded font-semibold mt-4"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}

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
