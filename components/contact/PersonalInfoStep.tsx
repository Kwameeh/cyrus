import { FormData } from "./ContactForm";
import { gsap } from "gsap";

interface PersonalInfoStepProps {
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

export default function PersonalInfoStep({
  formData,
  updateFormData,
}: PersonalInfoStepProps) {
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
          Personal Information
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            className="contact-form-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}>
            <div>
              <label htmlFor="firstName" style={labelStyle}>
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                style={inputStyle}
                placeholder="Enter your first name"
                required
                onFocus={(e) => {
                  gsap.to(e.target, {
                    borderColor: "#9ca3af",
                    boxShadow: "0 0 0 2px rgba(156, 163, 175, 0.2)",
                    scale: 1.02,
                    duration: 0.2,
                    ease: "power2.out",
                  });
                }}
                onBlur={(e) => {
                  gsap.to(e.target, {
                    borderColor: "#e5e7eb",
                    boxShadow: "none",
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out",
                  });
                }}
              />
            </div>
            <div>
              <label htmlFor="lastName" style={labelStyle}>
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
                style={inputStyle}
                placeholder="Enter your last name"
                required
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
          </div>

          <div>
            <label htmlFor="email" style={labelStyle}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              style={inputStyle}
              placeholder="your.email@example.com"
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
            <label htmlFor="phone" style={labelStyle}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              style={inputStyle}
              placeholder="+1 (555) 123-4567"
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
