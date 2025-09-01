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
      
      // Ensure it starts with +92 if user enters digits
      if (cleanValue && !cleanValue.startsWith('+')) {
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
      
      // Limit total length (including +92)
      if (cleanValue.length > 13) {
        cleanValue = cleanValue.substring(0, 13)
      }
      
      onChange(cleanValue)
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