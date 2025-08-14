import { useForm } from "react-hook-form";
import "./App1.css";

function App1() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("companyName", data.companyName);
    formData.append("chartType", data.chartType);
    formData.append("csvFile", data.csvFile[0]); // File input returns an array

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
  const errorText = await response.text();
  throw new Error(errorText || "Server error");
}

    const result = await response.json();
    console.log("Server response:", result);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} className="login-box">
        {/* Company Name */}
        <label>Company Name</label>
        <input
          className={errors.companyName ? "input-error" : ""}
          {...register("companyName", { required: "Company name is required" })}
          placeholder="Enter your company name"
        />
        {errors.companyName && <p className="error">{errors.companyName.message}</p>}

        {/* Chart Type */}
        <label>Choose Chart Type</label>
        <div className="radio-group">
          <label>
            <input type="radio" value="bar" {...register("chartType", { required: "Select a chart type" })} /> Bar Chart
          </label>
          <label>
            <input type="radio" value="pie" {...register("chartType")} /> Pie Chart
          </label>
          <label>
            <input type="radio" value="line" {...register("chartType")} /> Line Chart
          </label>
        </div>
        {errors.chartType && <p className="error">{errors.chartType.message}</p>}

        {/* CSV File Upload */}
        <label>Upload CSV File</label>
        <input
          type="file"
          accept=".csv"
          {...register("csvFile", { required: "CSV file is required" })}
        />
        {errors.csvFile && <p className="error">{errors.csvFile.message}</p>}

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default App1;
