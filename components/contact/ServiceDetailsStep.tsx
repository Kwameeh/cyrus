import { FormData } from "./ContactForm";

interface ServiceDetailsStepProps {
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

const labelStyle = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#374151",
  marginBottom: "0.5rem",
  fontFamily: "Inter, sans-serif",
};

export default function ServiceDetailsStep({
  formData,
  updateFormData,
}: ServiceDetailsStepProps) {
  const eventTypes = [
    "Wedding Photography",
    "Portrait Session",
    "Corporate Event",
    "Family Photos",
    "Engagement Session",
    "Product Photography",
    "Real Estate",
    "Other",
  ];

  const durations = [
    "1-2 hours",
    "3-4 hours",
    "5-6 hours",
    "Full Day (8+ hours)",
    "Multiple Days",
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
          Service Details
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="eventType" style={labelStyle}>
              Type of Photography *
            </label>
            <select
              id="eventType"
              value={formData.eventType}
              onChange={(e) => updateFormData("eventType", e.target.value)}
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
              <option value="">Select service type</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div
            className="contact-form-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}>
            <div>
              <label htmlFor="eventDate" style={labelStyle}>
                Preferred Date *
              </label>
              <input
                type="date"
                id="eventDate"
                value={formData.eventDate}
                onChange={(e) => updateFormData("eventDate", e.target.value)}
                style={inputStyle}
                required
                min={new Date().toISOString().split("T")[0]}
                onFocus={(e) => {
                  e.target.style.borderColor = "#9ca3af";
                  e.target.style.boxShadow =
                    "0 0 0 2px rgba(156, 163, 175, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label htmlFor="duration" style={labelStyle}>
                Duration
              </label>
              <select
                id="duration"
                value={formData.duration}
                onChange={(e) => updateFormData("duration", e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#9ca3af";
                  e.target.style.boxShadow =
                    "0 0 0 2px rgba(156, 163, 175, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}>
                <option value="">Select duration</option>
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="location" style={labelStyle}>
              Location *
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => updateFormData("location", e.target.value)}
              style={inputStyle}
              placeholder="Enter venue or location details"
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
        </div>
      </div>
    </div>
  );
}
