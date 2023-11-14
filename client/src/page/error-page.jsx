import { useRouteError } from "react-router-dom";
import { Alert } from "react-bootstrap";
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page"> 
        <p>
          Sorry, an unexpected error has occurred.
        </p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p> 
    </div>
  );
}