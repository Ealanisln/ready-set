import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

const PopupReadySet = () => {
  const [open, setOpen] = React.useState(true); // Inicialmente true para que se abra automáticamente

  // Opcional: Si quieres controlar exactamente cuándo se abre
  useEffect(() => {
    setOpen(true);
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <div className="p-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Ready Set</DialogTitle>
            <DialogDescription className="text-gray-500">
              This is a pop-up example
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p>Pop up content here.</p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Canceled
            </Button>
            <Button 
              onClick={() => {
                // Aquí puedes agregar tu lógica
                setOpen(false);
              }}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PopupReadySet;