"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import PersonalInfoStep from "./PersonalInfoStep";
import ServiceDetailsStep from "./ServiceDetailsStep";
import RequirementsStep from "./RequirementsStep";
import ProgressIndicator from "./ProgressIndicator";
import FormNavigation from "./FormNavigation";

export interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Service Details
  eventType: string;
  eventDate: string;
  location: string;
  duration: string;

  // Requirements
  description: string;
  budget: string;
  additionalRequests: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  location: "",
  duration: "",
  description: "",
  budget: "",
  additionalRequests: "",
};

export default function ContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalSteps = 3;
  const formStepRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const animateStepTransition = (
    direction: "next" | "prev",
    newStep: number
  ) => {
    if (isAnimating) return;

    setIsAnimating(true);

    const timeline = gsap.timeline({
      onComplete: () => {
        setCurrentStep(newStep);
        setIsAnimating(false);
      },
    });

    // Animate current step out
    timeline.to(formStepRef.current, {
      opacity: 0,
      x: direction === "next" ? -50 : 50,
      duration: 0.3,
      ease: "power2.inOut",
    });

    // Animate new step in
    timeline.fromTo(
      formStepRef.current,
      {
        opacity: 0,
        x: direction === "next" ? 50 : -50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        ease: "power2.inOut",
      }
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps && !isAnimating) {
      animateStepTransition("next", currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1 && !isAnimating) {
      animateStepTransition("prev", currentStep - 1);
    }
  };

  // Initial animation when component mounts
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // Animate form step changes
  useEffect(() => {
    if (formStepRef.current && !isAnimating) {
      gsap.fromTo(
        formStepRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [currentStep, isAnimating]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName.trim() &&
          formData.lastName.trim() &&
          formData.email.trim() &&
          validateEmail(formData.email)
        );
      case 2:
        return !!(
          formData.eventType &&
          formData.eventDate &&
          formData.location.trim()
        );
      case 3:
        return !!(formData.description.trim() && formData.budget);
      default:
        return false;
    }
  };

  const sendEmail = async (data: FormData) => {
    // Mock email service - replace with actual email service like EmailJS, Resend, etc.
    const emailData = {
      to: "your-email@domain.com",
      subject: `New Photography Inquiry from ${data.firstName} ${data.lastName}`,
      html: `
        <h2>New Photography Inquiry</h2>
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        
        <h3>Service Details</h3>
        <p><strong>Event Type:</strong> ${data.eventType}</p>
        <p><strong>Date:</strong> ${data.eventDate}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Duration:</strong> ${data.duration || "Not specified"}</p>
        
        <h3>Requirements</h3>
        <p><strong>Budget:</strong> ${data.budget}</p>
        <p><strong>Description:</strong></p>
        <p>${data.description}</p>
        ${
          data.additionalRequests
            ? `<p><strong>Additional Requests:</strong></p><p>${data.additionalRequests}</p>`
            : ""
        }
      `,
    };

    // Simulate API call
    console.log("Email data:", emailData);
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      await sendEmail(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      // You could add error state management here
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div
        className="contact-form-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e3e3db",
          padding: "2rem",
          overflow: "auto",
          zIndex: 1000,
        }}>
        <div
          className="contact-form-card"
          style={{
            backgroundColor: "rgba(227, 227, 219, 0.65)",
            backdropFilter: "blur(18px) saturate(140%)",
            WebkitBackdropFilter: "blur(18px) saturate(140%)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            borderRadius: "16px",
            padding: "2rem",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}>
              <svg
                style={{ width: "32px", height: "32px", color: "#22c55e" }}
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
            </div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "0.5rem",
                fontFamily: "Inter, sans-serif",
              }}>
              Thank You!
            </h2>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontFamily: "Inter, sans-serif",
                display: "block",
              }}>
              Your inquiry has been submitted successfully. We'll get back to
              you within 24 hours.
            </p>
            <button
              onClick={resetForm}
              style={{
                width: "100%",
                backgroundColor: "#1f2937",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "#374151")
              }
              onMouseOut={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "#1f2937")
              }>
              Submit Another Inquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="contact-form-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e3e3db",
        padding: "2rem",
        overflow: "auto",
        zIndex: 1000,
      }}>
      <div
        className="contact-form-card"
        style={{
          position: "relative",
          backgroundColor: "rgba(227, 227, 219, 0.65)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          borderRadius: "16px",
          padding: "3rem",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}>
        {/* Close Button */}
        <button
          onClick={() => window.history.back()}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#1f2937",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            fontWeight: "300",
            transition: "all 0.2s ease",
            backdropFilter: "blur(4px)",
          }}
          onMouseOver={(e) => {
            (e.target as HTMLElement).style.backgroundColor =
              "rgba(255, 255, 255, 0.2)";
            (e.target as HTMLElement).style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            (e.target as HTMLElement).style.backgroundColor =
              "rgba(255, 255, 255, 0.1)";
            (e.target as HTMLElement).style.transform = "scale(1)";
          }}>
          ×
        </button>

        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "300",
              color: "#1f2937",
              marginBottom: "0.5rem",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
            }}>
            Let's Work Together
          </h1>
          <p
            style={{
              color: "#6b7280",
              textAlign: "center",
              fontSize: "1rem",
              fontFamily: "Inter, sans-serif",
              display: "block",
            }}>
            Tell us about your photography needs
          </p>
        </div>

        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div
          ref={formStepRef}
          style={{
            marginTop: "3rem",
            minHeight: "400px",
          }}>
          {currentStep === 1 && (
            <PersonalInfoStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 2 && (
            <ServiceDetailsStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 3 && (
            <RequirementsStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
        </div>

        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={handleSubmit}
          canProceed={validateStep(currentStep) && !isAnimating}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
