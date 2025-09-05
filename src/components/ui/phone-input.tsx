import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value
      
      // Remove all non-digit characters except + at the beginning
      let cleanValue = inputValue.replace(/[^\d+]/g, '')
      
      // If empty, allow it for typing
      if (!cleanValue) {
        onChange(cleanValue)
        return
      }
      
      // Ensure it starts with + for international format
      if (!cleanValue.startsWith('+') && cleanValue.length > 0) {
        // If user starts typing digits without +, add it
        cleanValue = '+' + cleanValue
      }
      
      // Limit total length to reasonable international phone number length
      if (cleanValue.length > 15) {
        cleanValue = cleanValue.substring(0, 15)
      }
      
      // Basic validation: must start with + followed by digits
      if (cleanValue.match(/^\+\d*$/)) {
        onChange(cleanValue)
      }
    }

    return (
      <Input
        type="tel"
        className={cn(
          "flex min-h-10 w-full rounded-md border border-input bg-input text-input-foreground px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-input-foreground placeholder:text-input-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        value={value}
        onChange={handleChange}
        placeholder="+923334254321"
        ref={ref}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }