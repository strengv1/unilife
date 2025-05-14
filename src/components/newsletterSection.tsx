"use client"

import React, { useState } from "react";
import { Button } from "./ui/button";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    
    try {
      // Replace with your Google Script URL (instructions in comments below)
      const scriptURL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL as string;
      
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

  return (
    <section id="newsletter" className="py-16 bg-amber-100">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Newsletter Signup</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Subscribe to our newsletter to get the latest updates on upcoming events and exclusive offers.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-2 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ..."
            required
          />
          <Button 
            type="submit" 
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        
        {status === "success" && (
          <p className="text-green-600 mt-4">Thank you for subscribing!</p>
        )}
        {status === "error" && (
          <p className="text-red-600 mt-4">Something went wrong. Please try again.</p>
        )}
        
        <p className="text-xs text-muted-foreground mt-4">
          By subscribing, you agree to receive marketing emails from UNI LIFE. You can unsubscribe at any time. Read our{" "}
          <a href="/privacy" className="underline hover:text-black">Privacy Policy</a>.
        </p>
      </div>
    </section>
  );
};