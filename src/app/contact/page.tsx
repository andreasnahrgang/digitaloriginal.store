"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Navbar = dynamic(
  () => import("@/components/navbar").then(mod => ({ default: mod.Navbar })),
  { ssr: false, loading: () => <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" /> }
);
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Suspense fallback={<nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-border" />}>
        <Navbar />
      </Suspense>

            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-5xl mx-auto">
                    <header className="text-center mb-12 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                            Contact <span className="text-primary">Us</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have questions about our NFT collection? We&apos;re here to help you discover and collect digital art masterpieces.
                        </p>
                    </header>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card className="bg-secondary/5 border-border">
                            <CardHeader>
                                <CardTitle className="text-2xl text-white">Send us a Message</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-white">Name</Label>
                                        <Input id="name" placeholder="Your name" className="bg-black/50 border-border focus:border-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-white">Email</Label>
                                        <Input id="email" type="email" placeholder="your@email.com" className="bg-black/50 border-border focus:border-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="text-white">Subject</Label>
                                        <Input id="subject" placeholder="How can we help?" className="bg-black/50 border-border focus:border-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-white">Message</Label>
                                        <textarea
                                            id="message"
                                            className="flex min-h-[120px] w-full rounded-md border border-border bg-black/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white focus:border-primary"
                                            placeholder="Tell us more..."
                                        />
                                    </div>
                                    <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold">
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-secondary/5 border border-border rounded-xl p-8 space-y-4">
                                <h3 className="text-xl font-bold text-white">Email Support</h3>
                                <p className="text-muted-foreground">
                                    For general inquiries and support:
                                </p>
                                <a href="mailto:support@digitaloriginal.com" className="text-primary text-lg font-medium hover:underline">
                                    support@digitaloriginal.com
                                </a>
                            </div>



                            <div className="bg-secondary/5 border border-border rounded-xl p-8 space-y-4">
                                <h3 className="text-xl font-bold text-white">Response Time</h3>
                                <p className="text-muted-foreground">
                                    We typically respond to all inquiries within 24 hours during business days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
