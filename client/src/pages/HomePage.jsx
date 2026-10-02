import { lazy, Suspense } from 'react';

const HeroSection          = lazy(() => import('../components/home/HeroSection'));
const CategorySection      = lazy(() => import('../components/home/CategorySection'));
const TrendingSection      = lazy(() => import('../components/home/TrendingSection'));
const FlashSaleSection     = lazy(() => import('../components/home/FlashSaleSection'));
const RecommendSection     = lazy(() => import('../components/home/RecommendSection'));
const NewArrivalsSection   = lazy(() => import('../components/home/NewArrivalsSection'));
const WhyUsSection         = lazy(() => import('../components/home/WhyUsSection'));
const TestimonialsSection  = lazy(() => import('../components/home/TestimonialsSection'));
const NewsletterSection    = lazy(() => import('../components/home/NewsletterSection'));

const SectionSkeleton = () => (
  <div className="section">
    <div className="container-main">
      <div className="skeleton h-8 w-64 rounded-xl mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
      </div>
    </div>
  </div>
);

const HomePage = () => (
  <div>
    <Suspense fallback={<div className="h-[85vh] skeleton" />}>
      <HeroSection />
    </Suspense>
    <Suspense fallback={<SectionSkeleton />}>
      <CategorySection />
    </Suspense>
    <Suspense fallback={<SectionSkeleton />}>
      <TrendingSection />
    </Suspense>
    <Suspense fallback={<SectionSkeleton />}>
      <FlashSaleSection />
    </Suspense>
    <Suspense fallback={<SectionSkeleton />}>
      <RecommendSection />
    </Suspense>
    <Suspense fallback={<SectionSkeleton />}>
      <NewArrivalsSection />
    </Suspense>
    <Suspense fallback={null}>
      <WhyUsSection />
    </Suspense>
    <Suspense fallback={null}>
      <TestimonialsSection />
    </Suspense>
    <Suspense fallback={null}>
      <NewsletterSection />
    </Suspense>
  </div>
);

export default HomePage;
