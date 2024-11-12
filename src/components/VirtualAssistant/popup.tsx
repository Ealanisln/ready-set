import React from 'react';
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

const PopupDemo = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="p-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Open Pop-up</Button>
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
              Acceept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PopupDemo;