'use client'

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function HomePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const features = [
    {
      icon: '📊',
      title: 'Track Expenses',
      description:
        'Log your income and spending effortlessly. Categorize each transaction for a clear picture of your habits.',
    },
    {
      icon: '💰',
      title: 'Manage Budgets',
      description:
        "Set monthly or custom budgets, monitor your limits, and get alerts when you're overspending.",
    },
    {
      icon: '📈',
      title: 'Visualize Progress',
      description:
        'Use graphs and dashboards to visualize savings, track goals, and see where your money goes.',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-2 px-4 pt-[2px]">
      {/* Logo at the top */}
      <div className="flex justify-center py-2 mb-4">
        <Image
          src={theme === 'dark' ? '/logo-light.svg' : '/logo-dark.svg'}
          alt="TrackIt Logo"
          width={280}
          height={70}
          priority
        />
      </div>

      {/* Main content vertically centered */}
      <div className="flex flex-col items-center justify-center text-center space-y-10 max-w-4xl mx-auto mt-8 h-[calc(100vh-120px)]">
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight sm:text-7xl">
            Welcome to <span className="text-primary">TrackIt</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground px-4">
            Take control of your money. TrackIt helps you monitor your expenses, create smart budgets,
            and get financial insights in real-time.
          </p>
        </div>

        {/* Carousel for features */}
        <div className="w-full max-w-3xl mt-6">
          <Carousel className="w-full">
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index} className="px-2">
                  <div className="p-6 border rounded-xl space-y-3 shadow-md bg-card">
                    <h2 className="text-2xl font-semibold">
                      {feature.icon} {feature.title}
                    </h2>
                    <p className="text-muted-foreground text-lg">{feature.description}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-5 mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>

        {/* Get Started Button */}
        <div className="mt-8">
          <Button asChild size="lg" className="text-xl px-10 py-6">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
