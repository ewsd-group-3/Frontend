import { dialogState } from '@/states/dialog'
import React from 'react'
import { useRecoilState } from 'recoil'
import { DialogContent, DialogOverlay, DialogPortal, Dialog } from '../ui/dialog'
import { poppins } from '@/pages/_app'

const DialogCenter = () => {
  const [dialog, setDialog] = useRecoilState(dialogState)

  if (!dialog) return null

  if (!!dialog)
    return (
      <Dialog open={!!dialog} onOpenChange={() => setDialog(undefined)}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className={poppins.className}>
            <div>
              <h3 className="font-bold text-2xl">{dialog.title}</h3>
              {dialog.description && <p className="text-base mt-2">{dialog.description}</p>}
              {dialog.children && dialog.children}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    )
}

export default DialogCenter
