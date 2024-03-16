import { dialogState } from '@/states/dialog'
import React, { createElement } from 'react'
import { useRecoilState } from 'recoil'
import { DialogContent, DialogOverlay, DialogPortal, Dialog } from '../ui/dialog'
import { poppins } from '@/pages/_app'
import { Form } from '../ui/form'
import { Button } from '../ui/button'

const DialogCenter = () => {
  const [dialog, setDialog] = useRecoilState(dialogState)

  const handleCloseDialog = () => {
    setDialog(undefined)
  }

  if (!dialog) return null

  if (!!dialog)
    return (
      <Dialog open={!!dialog} onOpenChange={() => handleCloseDialog()}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className={poppins.className}>
            <Form defaultValues={dialog.defaultValues} formSchema={dialog.formSchema} onSubmit={dialog.onSubmit}>
              {values => (
                <div>
                  <h3 className='font-bold text-2xl'>{dialog.title}</h3>
                  {dialog.description && <p className='text-base mt-2'>{dialog.description}</p>}
                  {typeof dialog.children === 'function' ? dialog.children(values) : dialog.children}

                  <div className='mt-7 text-right space-x-3'>
                    {dialog.cancel && (
                      <Button
                        type='button'
                        variant={'outline'}
                        onClick={() => {
                          if (typeof dialog.cancel === 'boolean' || !dialog.cancel?.onClick) {
                            handleCloseDialog()
                          } else {
                            dialog.cancel?.onClick()
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant={'default'}
                      type={dialog.formSchema ? 'submit' : 'button'}
                      onClick={!!dialog.action?.onClick ? dialog.action.onClick : undefined}
                    >
                      {dialog?.action?.label || 'Submit'}
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    )
}

export default DialogCenter
