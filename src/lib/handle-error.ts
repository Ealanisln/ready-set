import { getURLFromRedirectError } from "next/dist/client/components/redirect"
import toast from "react-hot-toast";
import { z } from "zod"

export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong, please try again later."

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message
    })
    return errors.join("\n")
  } else if (err instanceof Error) {
    // Check if it's a redirect error by trying to get the URL
    try {
      const redirectUrl = getURLFromRedirectError(err as any)
      if (redirectUrl) {
        throw err // If it's a redirect error, rethrow it
      }
    } catch {}
    
    return err.message
  } else {
    return unknownError
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err)
  return toast.error(errorMessage)
}