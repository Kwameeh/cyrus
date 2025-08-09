interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Service Details" },
    { number: 3, title: "Requirements" },
  ];

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        {steps.map((step, index) => (
          <div
            key={step.number}
            style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  backgroundColor:
                    step.number <= currentStep ? "#1f2937" : "#e5e7eb",
                  color: step.number <= currentStep ? "white" : "#9ca3af",
                  fontFamily: "Inter, sans-serif",
                }}>
                {step.number <= currentStep ? (
                  step.number < currentStep ? (
                    <svg
                      style={{ width: "16px", height: "16px" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.number
                  )
                ) : (
                  step.number
                )}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  marginTop: "0.5rem",
                  fontWeight: "500",
                  transition: "color 0.3s ease",
                  color: step.number <= currentStep ? "#1f2937" : "#9ca3af",
                  fontFamily: "Inter, sans-serif",
                }}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                style={{
                  width: "48px",
                  height: "2px",
                  margin: "0 1rem",
                  transition: "background-color 0.3s ease",
                  backgroundColor:
                    step.number < currentStep ? "#1f2937" : "#e5e7eb",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
