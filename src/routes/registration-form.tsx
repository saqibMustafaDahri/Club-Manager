import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import logoUrl from "@/assets/neomora-logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

// --- Validation Schemas ---
const step1Schema = z.object({
  participantFirstName: z.string().min(1, "First name is required"),
  participantLastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE"], { required_error: "Gender is required" }),
  participantEmail: z.string().email("Invalid email").or(z.literal("")).optional(),
  participantPhone: z.string().min(1, "Phone number is required"),
  participantAddress: z.string().min(1, "Address is required"),
  participantEmergencyContact: z.string().min(1, "Emergency contact is required"),
});

const step2Schema = z.object({
  guardianFirstName: z.string().min(1, "First name is required"),
  guardianLastName: z.string().min(1, "Last name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  guardianEmail: z.string().email("Invalid email").min(1, "Email is required"),
  guardianPhone: z.string().min(1, "Phone is required"),
  guardianAddress: z.string().min(1, "Address is required"),
  guardianEmergencyContact: z.string().min(1, "Emergency contact is required"),
});

const registrationSchema = step1Schema.merge(step2Schema);

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const STEPS = [
  { id: 1, title: "Participant Details" },
  { id: 2, title: "Guardian Details" },
];

export const Route = createFileRoute("/registration-form")({
  component: RegistrationFormPage,
});

function RegistrationFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      participantFirstName: "",
      participantLastName: "",
      dateOfBirth: "",
      gender: undefined,
      participantEmail: "",
      participantPhone: "",
      participantAddress: "",
      participantEmergencyContact: "",

      guardianFirstName: "",
      guardianLastName: "",
      relationship: "",
      guardianEmail: "",
      guardianPhone: "",
      guardianAddress: "",
      guardianEmergencyContact: "",
    },
    mode: "onChange",
  });

  const { watch, setValue } = form;

  // Determine which schema to validate against for current step
  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await form.trigger([
        "participantFirstName", "participantLastName", "dateOfBirth",
        "gender", "participantEmail", "participantPhone",
        "participantAddress", "participantEmergencyContact"
      ]);
    } else if (currentStep === 2) {
      isValid = await form.trigger([
        "guardianFirstName", "guardianLastName", "relationship",
        "guardianEmail", "guardianPhone", "guardianAddress",
        "guardianEmergencyContact"
      ]);
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Registration Payload:", data);
      toast.success("Registration completed successfully!");
      setIsSuccess(true);
    } catch (err) {
      toast.error("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Registration Complete</CardTitle>
            <CardDescription>
              The participant has been successfully registered.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.close()}>Close Window</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className=" flex items-center justify-center">
          <img src={logoUrl} alt="Neomora" className="h-15 w-auto" />

          {/* <h1 className="text-3xl font-bold tracking-tight">Neomora Club Manager</h1> */}
        </div>

        <div className="mb-8 flex items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight">Registration Form</h1>
        </div>

        {/* Stepper Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="relative flex flex-col items-center flex-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors
                    ${currentStep > step.id ? 'border-primary bg-primary text-primary-foreground' :
                      currentStep === step.id ? 'border-primary text-primary' : 'border-muted-foreground/30 text-muted-foreground/50'}`}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <div className={`mt-2 text-xs font-medium ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`absolute top-5 left-[50%] -z-10 h-[2px] w-full bg-muted-foreground/20`}>
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-in-out"
                      style={{ width: currentStep > step.id ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>
                  Please fill out the details below carefully.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="participantFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl><Input placeholder="John" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="participantLastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="participantEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="participantPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input placeholder="+966 50 000 0000" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="participantAddress"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl><Input placeholder="123 Main St, Riyadh" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                      control={form.control}
                      name="selectLocation"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Select Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="RIYADH">Riyadh</SelectItem>
                              <SelectItem value="JEDDAH">Jeddah</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="selectSession"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Select Session</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Session" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="RIYADH">Riyadh</SelectItem>
                              <SelectItem value="JEDDAH">Jeddah</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <FormField
                      control={form.control}
                      name="participantEmergencyContact"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Emergency Contact</FormLabel>
                          <FormControl><Input placeholder="Name and Phone Number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="guardianFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guardian First Name</FormLabel>
                          <FormControl><Input placeholder="Jane" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guardianLastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guardian Last Name</FormLabel>
                          <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <FormControl><Input placeholder="Mother, Father, etc." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guardianEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" placeholder="jane@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guardianPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input placeholder="+966 50 000 0000" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guardianEmergencyContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact</FormLabel>
                          <FormControl><Input placeholder="Name and Phone Number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guardianAddress"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl><Input placeholder="123 Main St, Riyadh" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>

              <Separator className="my-4" />

              <CardFooter className="flex justify-between">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={handlePrev}>
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}

                {currentStep < STEPS.length ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
