// import { useState } from "react";
import {
  useProvidersQuery,
  useAddKeyMutation,
  useDeleteKeyMutation,
} from "@/lib/keys-hooks";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const PROVIDERS = ["openai", "groq"]; // keep in sync with server allowlist

const addKeySchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  apiKey: z.string().min(1, "API key is required"),
});

type AddKeySchemaType = z.infer<typeof addKeySchema>;

export function ProvidersManager() {
  const { data: providers = [], isLoading } = useProvidersQuery();
  const addKey = useAddKeyMutation();
  const delKey = useDeleteKeyMutation();

  const form = useForm<AddKeySchemaType>({
    resolver: zodResolver(addKeySchema),
    defaultValues: {
      provider: PROVIDERS[0],
      apiKey: "",
    },
  });
  console.log("prvrs--", providers);

  async function onSubmit(data: AddKeySchemaType) {
    try {
      const res = await addKey.mutateAsync(data);
      console.log("res-- -add key", res);

      form.reset();
    } catch (error) {
      console.error("Failed to add API key:", error);
    }
  }

  if (isLoading)
    return <div className="flex justify-center items-center p-8">Loading…</div>;

  return (
    <div className="space-y-8 w-full max-w-md mx-auto">
      {/* Add API Key Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-zinc-200">Add API Key</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Add your API keys to enable AI providers
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your API key"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your API key will be encrypted and stored securely
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full text-zinc-950"
              disabled={addKey.isPending}
            >
              {addKey.isPending ? "Adding..." : "Add API Key"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Manage API Keys Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-zinc-700">
            Manage API Keys
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {/* {JSON.stringify(providers)} */}
            {providers.length === 0
              ? "No API keys added yet"
              : `${providers.length} provider${providers.length === 1 ? "" : "s"} configured`}
          </p>
        </div>

        {providers.length > 0 && (
          <div className="space-y-3">
            {providers.map((provider) => (
              <div
                key={provider}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium capitalize text-zinc-300">
                    {provider}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => delKey.mutate(provider)}
                  disabled={delKey.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {delKey.isPending ? "Removing..." : "Remove"}
                </Button>
              </div>
            ))}
          </div>
        )}

        {providers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Add your first API key above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
