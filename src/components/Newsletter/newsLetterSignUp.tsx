import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your newsletter signup logic here (e.g., API call)
    console.log('Subscribing email:', email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="mt-4">
      <h3 className="text-base text-gray-400 mb-2">Subscribe to our Newsletter</h3>
      {!subscribed ? (
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Subscribe
          </button>
        </form>
      ) : (
        <p className="text-green-500">Thank you for subscribing!</p>
      )}
    </div>
  );
};

export default NewsletterSignup;