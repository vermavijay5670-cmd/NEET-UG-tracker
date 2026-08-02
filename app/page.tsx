import { LiquidBackdrop } from "@/components/ui/LiquidBackdrop";
import { MedicalBackdrop } from "@/components/landing/MedicalBackdrop";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProfileForm } from "@/components/landing/ProfileForm";
import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05050a]">
      <div className="absolute inset-0 z-0">
        <MedicalBackdrop />
        <LiquidBackdrop />
      </div>

      <div className="relative z-10">
        <LandingNav />
        <Hero />
        <section className="mx-auto mb-10 max-w-[1120px] px-4 sm:px-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
            <p className="text-sm text-white/70">Protect your study progress with a secure account.</p>
            <Link href="/auth" className="mt-4 inline-flex rounded-full bg-[#D8B4FE] px-5 py-2.5 text-sm font-medium text-[#0F0B18]">
              Sign in or create account
            </Link>
          </div>
        </section>
        <FeatureGrid />
        <HowItWorks />
        <ProfileForm />
        <LandingFooter />
      </div>
    </div>
  );
}
