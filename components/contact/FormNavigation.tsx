interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
}

export default function FormNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSubmit,
  canProceed,
  isSubmitting,
}: FormNavigationProps) {
  const baseButtonStyle = {
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    border: "none",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontFamily: "Inter, sans-serif",
  };

  const prevButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: currentStep === 1 ? "#f3f4f6" : "#e5e7eb",
    color: currentStep === 1 ? "#9ca3af" : "#374151",
    cursor: currentStep === 1 ? "not-allowed" : "pointer",
  };

  const nextButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: canProceed ? "#1f2937" : "#d1d5db",
    color: canProceed ? "white" : "#9ca3af",
    cursor: canProceed ? "pointer" : "not-allowed",
  };

  const submitButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: canProceed && !isSubmitting ? "#1f2937" : "#d1d5db",
    color: canProceed && !isSubmitting ? "white" : "#9ca3af",
    cursor: canProceed && !isSubmitting ? "pointer" : "not-allowed",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        display: "flex",
        justifyContent: "space-between",
      }}>
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1}
        style={prevButtonStyle}
        onMouseOver={(e) => {
          if (currentStep !== 1) {
            (e.target as HTMLButtonElement).style.backgroundColor = "#d1d5db";
          }
        }}
        onMouseOut={(e) => {
          if (currentStep !== 1) {
            (e.target as HTMLButtonElement).style.backgroundColor = "#e5e7eb";
          }
        }}>
        Previous
      </button>

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          style={nextButtonStyle}
          onMouseOver={(e) => {
            if (canProceed) {
              (e.target as HTMLButtonElement).style.backgroundColor = "#374151";
            }
          }}
          onMouseOut={(e) => {
            if (canProceed) {
              (e.target as HTMLButtonElement).style.backgroundColor = "#1f2937";
            }
          }}>
          Next Step
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canProceed || isSubmitting}
          style={submitButtonStyle}
          onMouseOver={(e) => {
            if (canProceed && !isSubmitting) {
              (e.target as HTMLButtonElement).style.backgroundColor = "#374151";
            }
          }}
          onMouseOut={(e) => {
            if (canProceed && !isSubmitting) {
              (e.target as HTMLButtonElement).style.backgroundColor = "#1f2937";
            }
          }}>
          {isSubmitting && (
            <svg
              style={{
                width: "16px",
                height: "16px",
                animation: "spin 1s linear infinite",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          )}
          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </button>
      )}
    </div>
  );
}
