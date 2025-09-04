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
          // Override default Input styling to match other form fields
          "flex w-full border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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