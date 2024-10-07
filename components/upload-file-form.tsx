"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { fileUploadSchema } from "@/lib/validations/fileUpload"
import { useRef } from "react"

interface UploadFileFormProps extends React.HTMLAttributes<HTMLFormElement> { }

type FormData = z.infer<typeof fileUploadSchema>

export function UploadFileForm({ className, ...props }: UploadFileFormProps) {
    const router = useRouter()
    const inputFileRef = useRef<HTMLInputElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(fileUploadSchema),
    })

    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [isSaving, setIsSaving] = React.useState<boolean>(false);
    const [currentFileIndex, setCurrentFileIndex] = React.useState<number>(0);

    // Function to handle file selection
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newFiles = Array.from(event.target.files || []);
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }

    // Function to remove a file from the selected list and clear the input field if necessary
    function handleRemoveFile(index: number) {
        setSelectedFiles((prevFiles) => {
            const updatedFiles = prevFiles.filter((_, i) => i !== index);
            if (updatedFiles.length === 0 && inputFileRef.current) {
                inputFileRef.current.value = ""; // Clear the file input field
            }
            updateFileInput(updatedFiles);
            return updatedFiles;
        });
    }

    // Function to update the file input's files
    function updateFileInput(files: File[]) {
        if (fileInputRef.current) {
            // Create a new DataTransfer object and add our files to it
            const dataTransfer = new DataTransfer();
            files.forEach(file => dataTransfer.items.add(file));

            // Set the file input's files to our DataTransfer object's files
            fileInputRef.current.files = dataTransfer.files;
        }
    }

    async function onSubmit(data: FormData) {
        if (selectedFiles.length === 0) {
            toast({
                title: "No files selected",
                description: "Please select a file to upload.",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        setCurrentFileIndex(0);
        let uploadSuccess = true; // Track whether all files were successfully uploaded

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            setCurrentFileIndex(i + 1); // Update the progress counter

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(`/api/upload?filename=${file.name}`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    uploadSuccess = false; // Mark that an error occurred
                    const errorMessage = await response.text();
                    toast({
                        title: "Upload failed",
                        description: `Failed to upload "${file.name}". ${errorMessage || 'Please try again.'}`,
                        variant: "destructive",
                    });
                    break; // Stop uploading if a file fails
                }
                const result = await response.json();

            } catch (error) {
                uploadSuccess = false; // Mark that an error occurred
                toast({
                    title: "Network Error",
                    description: `Failed to upload "${file.name}". Please check your connection and try again.`,
                    variant: "destructive",
                });
                break; // Stop uploading if a network error occurs
            }

            // Clear the file input after successful submission
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }

        setIsSaving(false);

        if (uploadSuccess) {
            toast({
                title: "Upload Complete",
                description: "All files have been successfully uploaded.",
            });

            setSelectedFiles([]); // Clear the file list
            if (inputFileRef.current) {
                inputFileRef.current.value = ""; // Clear the file input field
            }
        }

        router.refresh()
    }

    return (
        <Form {...form}>
            <form
                className={cn(className)}
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Upload File</CardTitle>
                        <CardDescription>
                            Upload a file to be used for training.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="file">
                                        File
                                    </FormLabel>
                                    <Input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleFileChange(e);
                                        }}
                                        id="file"
                                        multiple
                                    />
                                    <FormDescription>
                                        Select files to be used for training.
                                    </FormDescription>
                                    <FormMessage />
                                    {selectedFiles.length > 0 && (
                                        <div className="mt-4">
                                            <ul className="space-y-2">
                                                {selectedFiles.map((file, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                                                    >
                                                        <span className="text-sm text-black">{file.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFile(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Icons.close className="h-4 w-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <button
                            type="submit"
                            className={cn(buttonVariants(), className)}
                            disabled={isSaving || selectedFiles.length === 0}
                        >
                            {isSaving && (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    <span>
                                        Uploading file {currentFileIndex} of {selectedFiles.length}
                                    </span>
                                </>
                            )}
                            {!isSaving && <span>Upload</span>}
                        </button>
                    </CardFooter>
                </Card>
            </form>
        </Form >
    )
}