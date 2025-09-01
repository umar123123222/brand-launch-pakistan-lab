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
      
      // If empty or just +, allow it for typing
      if (!cleanValue || cleanValue === '+') {
        onChange(cleanValue)
        return
      }
      
      // Ensure it starts with +92 if user enters digits
      if (!cleanValue.startsWith('+92')) {
        if (cleanValue.startsWith('+')) {
          // If starts with + but not +92, enforce +92
          const digitsAfterPlus = cleanValue.substring(1)
          if (digitsAfterPlus.startsWith('92')) {
            cleanValue = '+' + digitsAfterPlus
          } else if (digitsAfterPlus.startsWith('3')) {
            cleanValue = '+92' + digitsAfterPlus
          } else if (digitsAfterPlus.startsWith('0')) {
            cleanValue = '+92' + digitsAfterPlus.substring(1)
          } else {
            cleanValue = '+92' + digitsAfterPlus
          }
        } else {
          // No + at start
          if (cleanValue.startsWith('92')) {
            cleanValue = '+' + cleanValue
          } else if (cleanValue.startsWith('3')) {
            cleanValue = '+92' + cleanValue
          } else if (cleanValue.startsWith('0')) {
            cleanValue = '+92' + cleanValue.substring(1)
          } else {
            cleanValue = '+92' + cleanValue
          }
        }
      }
      
      // Strict validation: must be exactly +92 followed by 10 digits starting with 3
      const validPattern = /^\+923\d{9}$/
      
      // Allow partial typing but enforce format
      if (cleanValue.length <= 13) {
        // Check if it's a valid prefix of the final format
        const targetFormat = '+923334254321'
        let isValidPrefix = true
        
        for (let i = 0; i < cleanValue.length; i++) {
          if (i === 0) {
            if (cleanValue[i] !== '+') isValidPrefix = false
          } else if (i === 1) {
            if (cleanValue[i] !== '9') isValidPrefix = false
          } else if (i === 2) {
            if (cleanValue[i] !== '2') isValidPrefix = false
          } else if (i === 3) {
            if (cleanValue[i] !== '3') isValidPrefix = false
          } else {
            // Positions 4-12 must be digits
            if (!/\d/.test(cleanValue[i])) isValidPrefix = false
          }
        }
        
        // Only allow valid prefixes of +923xxxxxxxxx
        if (isValidPrefix && cleanValue.length <= 13) {
          onChange(cleanValue)
        }
      }
    }

    return (
      <Input
        type="tel"
        className={cn(className)}
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