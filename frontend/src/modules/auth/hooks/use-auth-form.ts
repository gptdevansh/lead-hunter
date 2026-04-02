"use client";

import { useState } from "react";

export function useAuthForm<T extends Record<string, string>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  function setField<K extends keyof T>(field: K, value: string) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  return {
    values,
    setField,
  };
}