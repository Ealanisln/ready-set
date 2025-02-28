import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  FormProvider, 
  useForm 
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import toast from "react-hot-toast";

export const PasswordChange = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const methods = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const onPasswordSubmit = async (data: { password: string; confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      // Your implementation of password change
      // For example:
      // const response = await fetch('/api/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password: data.password }),
      // });
      // if (!response.ok) throw new Error('Failed to change password');
      
      toast.success("Password changed successfully");
      methods.reset();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password here</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <FormProvider {...methods}>
          {/* Changed from form to div */}
          <div className="space-y-4">
            <FormField
              control={methods.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={methods.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Changed to type="button" with onClick handler */}
            <Button 
              type="button"
              disabled={isLoading} 
              className="w-full" 
              onClick={methods.handleSubmit(onPasswordSubmit)}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </FormProvider>
      </CardContent>
    </Card>
  );
};