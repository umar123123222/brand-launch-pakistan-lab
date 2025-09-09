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
      
      // Allow common phone number characters: digits, spaces, dashes, parentheses, dots, plus
      let cleanValue = inputValue.replace(/[^0-9\s\-\(\)\.\+]/g, '')
      
      // Limit total length to reasonable phone number length
      if (cleanValue.length > 20) {
        cleanValue = cleanValue.substring(0, 20)
      }
      
      onChange(cleanValue)
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
        placeholder="03001234567"
        ref={ref}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }