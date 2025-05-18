"use client"

import React, { useState } from "react";
import { Button } from "./ui/button";

interface NewsletterFormProps {
  title: string;
  description: React.ReactNode;
  buttonText?: string;
  className?: string;
  containerClassName?: string;
  isSection?: boolean;
  disclaimerText?: string;
  privacyLinkText?: string;
  privacyLinkUrl?: string;
}

export const NewsletterForm = ({
  title,
  description,
  buttonText = "Subscribe",
  className = "",
  containerClassName = "",
  isSection = false,
  disclaimerText = "By subscribing, you agree to receive emails from UNI LIFE. You can unsubscribe at any time.",
  privacyLinkText = "Privacy Policy",
  privacyLinkUrl = "/privacy",
}: NewsletterFormProps) => {
  const [firstName, setFirstName] = useState("") // Honeypot-field! Keep invisible to users
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    // Check if the honeypot field is filled (bot detection)
    if (firstName !== "") {
      // This is likely a bot - silently "succeed" without actually submitting
      setTimeout(() => {
        console.log("Honeypot triggered - likely bot submission");
        setEmail("");
        setStatus("success"); // Show success message to avoid tipping off the bot
        setIsSubmitting(false);
      }, 1243)
      return;
    }

    try {
      const scriptURL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
      
      if (!scriptURL) {
        console.error("Google Script URL not found in environment variables");
        setStatus("error");
        setIsSubmitting(false);
        return;
      }
      
      const formData = new FormData();
      formData.append("email", email);
      
      const response = await fetch(scriptURL, {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        setEmail("");
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create appropriate wrapper based on isSection prop
  const Wrapper = isSection ? "section" : "div";
  
  return (
    <Wrapper id="newsletter" className={containerClassName}>
      <div className={`text-center ${className}`}>
        {title && <h3 className="text-2xl font-bold mb-2">{title}</h3>}
        {description}
        
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-2 max-w-md mx-auto"
          aria-labelledby="newsletter-heading"
        >
          <h4 id="newsletter-heading" className="sr-only">Newsletter Signup</h4>
          
                  {/* Honeypot field - hidden from humans but visible to bots */}
                  <input
                    type="text"
                    name="firstName" // Common names like "website", "url", or "phone" attract bots
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      position: 'absolute',
                      left: '-9900px',
                      height: 0,
                      width: 0,
                      opacity: 0,
                      zIndex: -1,
                    }}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="Enter your email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
            aria-label="Your email address"
          />
          <Button 
            type="submit" 
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : buttonText}
          </Button>
        </form>
        
        {status === "success" && (
          <p className="text-green-600 mt-4">Thank you for subscribing!</p>
        )}
        {status === "error" && (
          <p className="text-red-600 mt-4">Something went wrong. Please try again.</p>
        )}
        
        <p className="text-xs text-muted-foreground mt-4">
          {disclaimerText} Read our{" "}
          <a href={privacyLinkUrl} className="underline hover:text-black">{privacyLinkText}</a>.
        </p>
      </div>
    </Wrapper>
  );
};

export const NewsletterSection = () => {
  return (
    <NewsletterForm
      isSection={true}
      containerClassName="py-16 bg-amber-100 px-4"
      title="Newsletter Signup"
      description={<p className="mb-6 max-w-xl mx-auto">Subscribe to our newsletter to get the latest updates on upcoming events and exclusive offers.</p>}
      disclaimerText="By subscribing, you agree to receive marketing emails from UNI LIFE. You can unsubscribe at any time."
    />
  );
};
