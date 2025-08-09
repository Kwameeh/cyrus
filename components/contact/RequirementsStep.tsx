import { FormData } from "./ContactForm";

interface RequirementsStepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "0.875rem",
  fontFamily: "Inter, sans-serif",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(4px)",
  transition: "all 0.2s ease",
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  resize: "none" as const,
  minHeight: "100px",
};

const labelStyle = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#374151",
  marginBottom: "0.5rem",
  fontFamily: "Inter, sans-serif",
};

export default function RequirementsStep({
  formData,
  updateFormData,
}: RequirementsStepProps) {
  const budgetRanges = [
    "$500 - $1,000",
    "$1,000 - $2,500",
    "$2,500 - $5,000",
    "$5,000 - $10,000",
    "$10,000+",
    "Let's discuss",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "500",
            color: "#1f2937",
            marginBottom: "1.5rem",
            fontFamily: "Inter, sans-serif",
          }}>
          Requirements & Budget
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="description" style={labelStyle}>
              Project Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              style={textareaStyle}
              placeholder="Tell us about your photography needs, style preferences, special moments to capture, etc."
              rows={4}
              required
              onFocus={(e) => {
                e.target.style.borderColor = "#9ca3af";
                e.target.style.boxShadow = "0 0 0 2px rgba(156, 163, 175, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label htmlFor="budget" style={labelStyle}>
              Budget Range *
            </label>
            <select
              id="budget"
              value={formData.budget}
              onChange={(e) => updateFormData("budget", e.target.value)}
              style={inputStyle}
              required
              onFocus={(e) => {
                e.target.style.borderColor = "#9ca3af";
                e.target.style.boxShadow = "0 0 0 2px rgba(156, 163, 175, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}>
              <option value="">Select your budget range</option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="additionalRequests" style={labelStyle}>
              Additional Requests
            </label>
            <textarea
              id="additionalRequests"
              value={formData.additionalRequests}
              onChange={(e) =>
                updateFormData("additionalRequests", e.target.value)
              }
              style={{ ...textareaStyle, minHeight: "80px" }}
              placeholder="Any special equipment needs, specific shots, post-processing requests, etc."
              rows={3}
              onFocus={(e) => {
                e.target.style.borderColor = "#9ca3af";
                e.target.style.boxShadow = "0 0 0 2px rgba(156, 163, 175, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
