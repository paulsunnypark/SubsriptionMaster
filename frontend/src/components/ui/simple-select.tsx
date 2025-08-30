"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimpleSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  className?: string
}

interface SimpleSelectTriggerProps {
  className?: string
  children: React.ReactNode
}

interface SimpleSelectContentProps {
  children: React.ReactNode
}

interface SimpleSelectItemProps {
  value: string
  children: React.ReactNode
}

interface SimpleSelectValueProps {
  placeholder?: string
}

const SimpleSelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}>({})

const SimpleSelect = ({ value, onValueChange, placeholder, children, className }: SimpleSelectProps) => {
  return (
    <SimpleSelectContext.Provider value={{ value, onValueChange, placeholder }}>
      <div className={cn("relative", className)}>
        {children}
      </div>
    </SimpleSelectContext.Provider>
  )
}

const SimpleSelectTrigger = ({ className, children }: SimpleSelectTriggerProps) => {
  return (
    <div className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}>
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
  )
}

const SimpleSelectValue = ({ placeholder }: SimpleSelectValueProps) => {
  const { value, placeholder: contextPlaceholder } = React.useContext(SimpleSelectContext)
  return <span>{value || placeholder || contextPlaceholder}</span>
}

const SimpleSelectContent = ({ children }: SimpleSelectContentProps) => {
  const { value, onValueChange } = React.useContext(SimpleSelectContext)
  
  return (
    <select 
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      value={value || ''}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      <option value="">선택하세요</option>
      {children}
    </select>
  )
}

const SimpleSelectItem = ({ value, children }: SimpleSelectItemProps) => {
  return <option value={value}>{children}</option>
}

// 호환성을 위한 별칭
const Select = SimpleSelect
const SelectTrigger = SimpleSelectTrigger
const SelectValue = SimpleSelectValue
const SelectContent = SimpleSelectContent
const SelectItem = SimpleSelectItem

export {
  SimpleSelect,
  SimpleSelectTrigger,
  SimpleSelectValue,
  SimpleSelectContent,
  SimpleSelectItem,
  // 호환성 별칭
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
