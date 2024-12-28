// ErrorPage.jsx
import React from 'react';

const ErrorPage = () => {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>Sorry, there was an error processing your request. Please try again later.</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
};

export default ErrorPage;
