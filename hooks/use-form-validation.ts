"use client"

import { useState, useCallback } from "react"
import { z } from "zod"

interface ValidationRule<T> {
  validator: (value: T) => boolean
  message: string
}

interface UseFormValidationProps<T> {
  initialValues: T
  validationSchema?: z.ZodType<T>
  customValidations?: {
    [K in keyof T]?: ValidationRule<T[K]>[]
  }
  onSubmit: (values: T) => void | Promise<void>
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  customValidations,
  onSubmit,
}: UseFormValidationProps<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback(
    async (name: keyof T, value: T[keyof T]) => {
      let fieldErrors: string[] = []

      // Zod schema validation
      if (validationSchema) {
        try {
          await validationSchema.parseAsync({ ...values, [name]: value })
        } catch (error) {
          if (error instanceof z.ZodError) {
            const fieldError = error.errors.find((err) => err.path[0] === name)
            if (fieldError) {
              fieldErrors.push(fieldError.message)
            }
          }
        }
      }

      // Custom validations
      if (customValidations?.[name]) {
        customValidations[name]?.forEach((rule) => {
          if (!rule.validator(value)) {
            fieldErrors.push(rule.message)
          }
        })
      }

      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[0] || "",
      }))

      return fieldErrors.length === 0
    },
    [values, validationSchema, customValidations]
  )

  const handleChange = useCallback(
    async (name: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({ ...prev, [name]: value }))
      await validateField(name, value)
    },
    [validateField]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)

      try {
        // Validate all fields
        const validationPromises = Object.entries(values).map(([name, value]) =>
          validateField(name as keyof T, value)
        )
        const validationResults = await Promise.all(validationPromises)

        if (validationResults.every((isValid) => isValid)) {
          await onSubmit(values)
          setErrors({})
        }
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validateField, onSubmit]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
  }
} 