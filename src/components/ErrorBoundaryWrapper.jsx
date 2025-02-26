// import { ErrorBoundary } from "react-error-boundary";

// const ErrorFallback = ({ error, resetErrorBoundary }) => {
//   return (
//     <div className="text-center text-red-600 font-bold">
//       <h2>Something went wrong.</h2>
//       <p>{error.message}</p>
//       <button
//         onClick={resetErrorBoundary}
//         className="px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Try again
//       </button>
//     </div>
//   );
// };

// const ErrorBoundaryWrapper = ({ children }) => {
//   return (
//     <ErrorBoundary
//       FallbackComponent={ErrorFallback}
//       onReset={() => window.location.reload()}
//     >
//       {children}
//     </ErrorBoundary>
//   );
// };

// export default ErrorBoundaryWrapper;
