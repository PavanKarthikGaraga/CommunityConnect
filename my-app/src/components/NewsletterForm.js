'use client';

export default function NewsletterForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
  };

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Enter your email" 
        aria-label="Email for newsletter"
      />
      <button type="submit" className="btn btn-primary">
        Subscribe
      </button>
    </form>
  );
} 