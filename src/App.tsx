import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Plus, Trash2, Download, Copy, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { cn } from './lib/utils';

type Field = { id: string; label: string; value: string };

type Slide = {
  id: string;
  logoText: string;
  badgeTop: string;
  badgeMiddle: string;
  badgeBottom: string;
  title: string;
  subtitle: string;
  fields: Field[];
  footerText: string;
};

const defaultSlide: Slide = {
  id: '1',
  logoText: 'EarthSync',
  badgeTop: 'AI',
  badgeMiddle: 'شركات ناشئة للمتابعة',
  badgeBottom: 'فبراير 2026',
  title: 'إيرث سينك',
  subtitle: 'تحسين قرارات الطاقة النظيفة للشركات',
  fields: [
    { id: 'f1', label: 'المقر الرئيسي', value: 'بنغالورو' },
    { id: 'f2', label: 'المؤسسون', value: 'مهول كومار، راجات سينغ' },
    { id: 'f3', label: 'سنة الإطلاق', value: '2024' },
    { id: 'f4', label: 'القطاع', value: 'الذكاء الاصطناعي للمناخ' },
    { id: 'f5', label: 'إجمالي التمويل', value: '1 مليون دولار' },
    { id: 'f6', label: 'أبرز المستثمرين', value: 'ثيا فينتشرز، إكسيميوس فينتشرز' },
    { id: 'f7', label: 'المنافسون', value: 'أورورا سولار، بليكسيجريد' },
  ],
  footerText: 'Inc42',
};

export default function App() {
  const [slides, setSlides] = useState<Slide[]>([defaultSlide]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[currentIndex];

  const updateSlide = (updates: Partial<Slide>) => {
    setSlides(slides.map((s, i) => (i === currentIndex ? { ...s, ...updates } : s)));
  };

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    updateSlide({
      fields: currentSlide.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
    });
  };

  const addField = () => {
    updateSlide({
      fields: [...currentSlide.fields, { id: Date.now().toString(), label: 'عنوان جديد', value: 'قيمة جديدة' }],
    });
  };

  const removeField = (fieldId: string) => {
    updateSlide({
      fields: currentSlide.fields.filter((f) => f.id !== fieldId),
    });
  };

  const addSlide = () => {
    const newSlide = { ...currentSlide, id: Date.now().toString() };
    setSlides([...slides, newSlide]);
    setCurrentIndex(slides.length);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentIndex >= newSlides.length) {
      setCurrentIndex(newSlides.length - 1);
    }
  };

  const duplicateSlide = () => {
    const newSlide = { ...currentSlide, id: Date.now().toString() };
    const newSlides = [...slides];
    newSlides.splice(currentIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentIndex(currentIndex + 1);
  };

  const exportImage = useCallback(async () => {
    if (canvasRef.current === null) return;
    setIsExporting(true);
    try {
      // Small delay to ensure rendering is complete
      await new Promise((resolve) => setTimeout(resolve, 100));
      const dataUrl = await toPng(canvasRef.current, {
        quality: 1,
        pixelRatio: 1, // Export at true dimensions (1080x1080)
        width: 1080,
        height: 1080,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }, // Ensure no scaling issues
      });
      const link = document.createElement('a');
      link.download = `slide-${currentIndex + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      alert('حدث خطأ أثناء تصدير الصورة.');
    } finally {
      setIsExporting(false);
    }
  }, [currentIndex]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans" dir="rtl">
      {/* Sidebar Controls */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg z-10">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">محرر الكاروسيل</h1>
          <button
            onClick={exportImage}
            disabled={isExporting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isExporting ? 'جاري التصدير...' : (
              <>
                <Download size={16} />
                تصدير
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Header Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">الترويسة</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">نص الشعار (أعلى اليمين)</label>
                <input
                  type="text"
                  value={currentSlide.logoText}
                  onChange={(e) => updateSlide({ logoText: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  dir="ltr"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">الشارة (علوي)</label>
                  <input
                    type="text"
                    value={currentSlide.badgeTop}
                    onChange={(e) => updateSlide({ badgeTop: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">الشارة (سفلي)</label>
                  <input
                    type="text"
                    value={currentSlide.badgeBottom}
                    onChange={(e) => updateSlide({ badgeBottom: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">الشارة (وسط)</label>
                <input
                  type="text"
                  value={currentSlide.badgeMiddle}
                  onChange={(e) => updateSlide({ badgeMiddle: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Main Content Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">المحتوى الرئيسي</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">العنوان الرئيسي</label>
                <input
                  type="text"
                  value={currentSlide.title}
                  onChange={(e) => updateSlide({ title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">العنوان الفرعي</label>
                <input
                  type="text"
                  value={currentSlide.subtitle}
                  onChange={(e) => updateSlide({ subtitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Grid Fields Section */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">الحقول (الشبكة)</h2>
              <button
                onClick={addField}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
              >
                <Plus size={14} /> إضافة حقل
              </button>
            </div>
            <div className="space-y-3">
              {currentSlide.fields.map((field) => (
                <div key={field.id} className="bg-gray-50 p-3 rounded-md border border-gray-200 relative group">
                  <button
                    onClick={() => removeField(field.id)}
                    className="absolute top-2 left-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="حذف الحقل"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="العنوان (مثال: المقر)"
                      className="w-full bg-transparent border-b border-gray-300 px-1 py-1 text-xs font-bold text-gray-700 outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateField(field.id, { value: e.target.value })}
                      placeholder="القيمة"
                      className="w-full bg-transparent border-b border-gray-300 px-1 py-1 text-sm text-gray-800 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Footer Section */}
          <section className="space-y-4 pb-8">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">التذييل</h2>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">نص التذييل</label>
              <input
                type="text"
                value={currentSlide.footerText}
                onChange={(e) => updateSlide({ footerText: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                dir="ltr"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative bg-gray-200">
        {/* Canvas Container - Centered and Scaled */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8">
          <div className="relative shadow-2xl transition-transform duration-200" style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
            {/* The actual canvas element to be exported */}
            <div
              ref={canvasRef}
              id="canvas-node"
              className="w-[1080px] h-[1080px] relative overflow-hidden flex flex-col canvas-container"
              dir="rtl"
            >
              {/* Noise Overlay */}
              <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none noise-overlay" />

              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col h-full p-16">
                
                {/* Top Section: Logo and Badge (Reversed) */}
                <div className="flex justify-between items-start mb-16">
                  {/* Badge (Now on the right in RTL) */}
                  <div className="relative p-[1px] border border-dashed border-gray-500/50">
                    {/* Decorative star */}
                    <div className="absolute -top-4 -right-4 text-white opacity-80">✨</div>
                    
                    <div className="bg-[#1a2332] flex items-stretch h-24">
                      {/* Left Cyan Block */}
                      <div className="bg-gradient-to-br from-cyan-300 to-cyan-500 w-24 flex items-center justify-center">
                        <span className="text-5xl font-black text-white" dir="ltr">{currentSlide.badgeTop}</span>
                      </div>
                      {/* Right Text Block */}
                      <div className="px-6 py-3 flex flex-col justify-center items-start">
                        <span className="text-2xl font-bold text-cyan-400 tracking-wide">{currentSlide.badgeMiddle}</span>
                        <div className="bg-white text-gray-900 text-xs font-bold px-2 py-1 mt-1 rounded-sm" dir="ltr">
                          {currentSlide.badgeBottom}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logo Box (Now on the left in RTL) */}
                  <div className="bg-white px-6 py-4 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <span className="text-3xl font-medium text-green-900 tracking-tight" dir="ltr">
                      {currentSlide.logoText}
                      <span className="inline-block ml-1 text-green-700">⟳</span>
                    </span>
                  </div>
                </div>

                {/* Title Section */}
                <div className="mb-10">
                  <h1 className="text-6xl font-bold text-cyan-100 mb-4 tracking-tight">{currentSlide.title}</h1>
                  <p className="text-2xl text-gray-300 font-medium">{currentSlide.subtitle}</p>
                </div>

                {/* Grid Section */}
                <div className="flex-1 relative">
                  {/* Decorative border */}
                  <div className="absolute inset-0 border border-gray-500/30 rounded-sm pointer-events-none">
                    {/* Corner markers */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-300"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gray-300"></div>
                  </div>
                  
                  {/* Grid Content */}
                  <div className="grid grid-cols-2 gap-x-16 gap-y-12 p-10 h-full content-start">
                    {currentSlide.fields.map((field) => (
                      <div key={field.id} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-cyan-300">
                          <span className="text-xl leading-none -mt-1">□</span>
                          <span className="text-lg font-bold tracking-widest uppercase">{field.label}</span>
                        </div>
                        <div className="text-2xl text-gray-200 font-medium leading-relaxed pr-6">
                          {field.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Decorative abstract square on the left */}
                  <div className="absolute -top-12 -left-4 w-24 h-24 border border-white/20 flex items-center justify-center opacity-80">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-400/40 to-blue-600/40 mix-blend-screen decorative-pattern"></div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end">
                  <span className="text-4xl font-bold text-white tracking-tighter" dir="ltr">{currentSlide.footerText}</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Carousel Navigation */}
        <div className="h-32 bg-white border-t border-gray-200 flex items-center px-6 gap-4 overflow-x-auto shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10">
          <button
            onClick={addSlide}
            className="flex-shrink-0 w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Plus size={24} />
            <span className="text-xs font-medium mt-1">جديد</span>
          </button>
          
          <div className="w-px h-16 bg-gray-200 mx-2"></div>

          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "flex-shrink-0 w-32 h-20 rounded-lg border-2 cursor-pointer relative group overflow-hidden transition-all",
                currentIndex === index ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setCurrentIndex(index)}
            >
              {/* Mini preview placeholder */}
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                 <span className="text-white text-xs truncate px-2">{slide.title || `شريحة ${index + 1}`}</span>
              </div>
              
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); duplicateSlide(); }}
                  className="p-1.5 bg-white text-gray-700 rounded hover:bg-blue-50 hover:text-blue-600"
                  title="تكرار"
                >
                  <Copy size={14} />
                </button>
                {slides.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSlide(index); }}
                    className="p-1.5 bg-white text-gray-700 rounded hover:bg-red-50 hover:text-red-600"
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              
              {/* Active indicator */}
              {currentIndex === index && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
