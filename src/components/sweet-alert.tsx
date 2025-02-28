'use client'

import { useEffect } from 'react'
import Swal from 'sweetalert2'

interface SweetAlertProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'question'
  message: string
  isOpen: boolean
  onClose?: () => void
  showConfirmButton?: boolean
  confirmText?: string
  onConfirm?: () => void
  showCancelButton?: boolean
  cancelText?: string
}

export function SweetAlert({
  type,
  message,
  isOpen,
  onClose,
  showConfirmButton = false,
  confirmText = 'ตกลง',
  onConfirm,
  showCancelButton = false,
  cancelText = 'ยกเลิก',
}: SweetAlertProps) {
  useEffect(() => {
    if (isOpen) {
      Swal.fire({
        icon: type,
        text: message,
        timer: showConfirmButton ? undefined : 2000,
        timerProgressBar: !showConfirmButton,
        showConfirmButton: showConfirmButton,
        confirmButtonText: confirmText,
        showCancelButton: showCancelButton,
        cancelButtonText: cancelText,
      }).then((result) => {
        if (result.isConfirmed && onConfirm) {
          onConfirm()
        } else {
          if (onClose) onClose()
        }
      })
    }
  }, [
    isOpen,
    type,
    message,
    onClose,
    showConfirmButton,
    confirmText,
    showCancelButton,
    cancelText,
    onConfirm,
  ])

  return null
}
