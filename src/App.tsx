import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Plus, Trash2, Download, Copy, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { cn } from './lib/utils';

type Field = { id: string; label: string; value: string };

type Theme = {
  id: string;
  name: string;
  canvasBg: string;
  accentColor: string;
  textColor: string;
  secondaryTextColor: string;
  badgeBg: string;
  badgeAccent: string;
  badgeTextColor: string;
  logoBg: string;
  logoTextColor: string;
  gridIconColor: string;
  dividerColor: string;
  patternOpacity: number;
};

type Slide = {
  id: string;
  logoText: string;
  badgeTop: string;
  badgeMiddle: string;
  badgeBottom: string;
  title: string;
  subtitle: string;
  fields: Field[];
  footerRight: string;
  footerLeft: string;
  themeId: string;
  logoImage?: string;
  badgeImage?: string;
};

const themes: Theme[] = [
  {
    id: 'navy-dark',
    name: 'كحلي عميق (ليلي)',
    canvasBg: 'bg-[#0a0f16]',
    accentColor: 'text-cyan-300',
    textColor: 'text-white',
    secondaryTextColor: 'text-gray-300',
    badgeBg: 'bg-[#1a2332]',
    badgeAccent: 'from-cyan-400 to-blue-500',
    badgeTextColor: 'text-cyan-400',
    logoBg: 'bg-white',
    logoTextColor: 'text-gray-900',
    gridIconColor: 'text-cyan-400',
    dividerColor: 'via-white/20',
    patternOpacity: 0.15,
  },
  {
    id: 'navy-light',
    name: 'كحلي هادئ (نهاري)',
    canvasBg: 'bg-[#f0f4f8]',
    accentColor: 'text-blue-600',
    textColor: 'text-blue-950',
    secondaryTextColor: 'text-blue-800/70',
    badgeBg: 'bg-white shadow-sm',
    badgeAccent: 'from-blue-600 to-indigo-700',
    badgeTextColor: 'text-blue-700',
    logoBg: 'bg-blue-900',
    logoTextColor: 'text-white',
    gridIconColor: 'text-blue-500',
    dividerColor: 'via-blue-200',
    patternOpacity: 0.05,
  },
  {
    id: 'navy-midnight',
    name: 'كحلي ملكي',
    canvasBg: 'bg-[#050b18]',
    accentColor: 'text-blue-400',
    textColor: 'text-slate-100',
    secondaryTextColor: 'text-slate-400',
    badgeBg: 'bg-[#111827]',
    badgeAccent: 'from-indigo-500 to-blue-600',
    badgeTextColor: 'text-indigo-300',
    logoBg: 'bg-slate-200',
    logoTextColor: 'text-blue-950',
    gridIconColor: 'text-indigo-400',
    dividerColor: 'via-slate-700',
    patternOpacity: 0.1,
  },
  {
    id: 'navy-gradient',
    name: 'كحلي متدرج',
    canvasBg: 'bg-gradient-to-br from-[#0f172a] to-[#1e293b]',
    accentColor: 'text-teal-400',
    textColor: 'text-white',
    secondaryTextColor: 'text-slate-300',
    badgeBg: 'bg-slate-800/80',
    badgeAccent: 'from-teal-500 to-emerald-600',
    badgeTextColor: 'text-teal-300',
    logoBg: 'bg-white',
    logoTextColor: 'text-slate-900',
    gridIconColor: 'text-teal-500',
    dividerColor: 'via-teal-500/30',
    patternOpacity: 0.1,
  },
  {
    id: 'navy-corporate',
    name: 'كحلي احترافي',
    canvasBg: 'bg-[#0f1c2e]',
    accentColor: 'text-sky-400',
    textColor: 'text-sky-50',
    secondaryTextColor: 'text-sky-200/60',
    badgeBg: 'bg-[#1f2937]',
    badgeAccent: 'from-sky-600 to-sky-400',
    badgeTextColor: 'text-sky-300',
    logoBg: 'bg-sky-50',
    logoTextColor: 'text-[#0f1c2e]',
    gridIconColor: 'text-sky-400',
    dividerColor: 'via-sky-400/20',
    patternOpacity: 0.12,
  },
  {
    id: 'dark-slate',
    name: 'رمادي عصري',
    canvasBg: 'bg-[#111827]',
    accentColor: 'text-emerald-400',
    textColor: 'text-white',
    secondaryTextColor: 'text-gray-400',
    badgeBg: 'bg-gray-800',
    badgeAccent: 'from-emerald-500 to-teal-600',
    badgeTextColor: 'text-emerald-300',
    logoBg: 'bg-white',
    logoTextColor: 'text-gray-900',
    gridIconColor: 'text-emerald-500',
    dividerColor: 'via-emerald-500/20',
    patternOpacity: 0.08,
  },
  {
    id: 'pure-white',
    name: 'أبيض بسيط',
    canvasBg: 'bg-white',
    accentColor: 'text-gray-900',
    textColor: 'text-gray-900',
    secondaryTextColor: 'text-gray-500',
    badgeBg: 'bg-gray-50 border border-gray-200',
    badgeAccent: 'from-gray-800 to-gray-600',
    badgeTextColor: 'text-gray-700',
    logoBg: 'bg-gray-900',
    logoTextColor: 'text-white',
    gridIconColor: 'text-gray-400',
    dividerColor: 'via-gray-200',
    patternOpacity: 0.03,
  },
  {
    id: 'luxury-black',
    name: 'أسود فاخر',
    canvasBg: 'bg-[#0a0a0a]',
    accentColor: 'text-amber-400',
    textColor: 'text-white',
    secondaryTextColor: 'text-gray-500',
    badgeBg: 'bg-zinc-900',
    badgeAccent: 'from-amber-600 to-yellow-500',
    badgeTextColor: 'text-amber-200',
    logoBg: 'bg-amber-400',
    logoTextColor: 'text-black',
    gridIconColor: 'text-amber-500',
    dividerColor: 'via-amber-500/20',
    patternOpacity: 0.2,
  },
  {
    id: 'crimson-night',
    name: 'أحمر داكن',
    canvasBg: 'bg-[#1a0b0b]',
    accentColor: 'text-rose-400',
    textColor: 'text-rose-50',
    secondaryTextColor: 'text-rose-200/50',
    badgeBg: 'bg-[#2a1313]',
    badgeAccent: 'from-rose-600 to-rose-400',
    badgeTextColor: 'text-rose-300',
    logoBg: 'bg-white',
    logoTextColor: 'text-rose-950',
    gridIconColor: 'text-rose-500',
    dividerColor: 'via-rose-500/20',
    patternOpacity: 0.1,
  },
  {
    id: 'forest-modern',
    name: 'أخضر ملكي',
    canvasBg: 'bg-[#061a14]',
    accentColor: 'text-lime-400',
    textColor: 'text-lime-50',
    secondaryTextColor: 'text-lime-200/50',
    badgeBg: 'bg-[#0d2a20]',
    badgeAccent: 'from-lime-600 to-green-500',
    badgeTextColor: 'text-lime-300',
    logoBg: 'bg-white',
    logoTextColor: 'text-[#061a14]',
    gridIconColor: 'text-lime-400',
    dividerColor: 'via-lime-500/20',
    patternOpacity: 0.12,
  },
];

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
  footerRight: 'منصة المستثمر الاقتصادية',
  footerLeft: 'al-investor.com',
  themeId: 'navy-dark',
  logoImage: undefined,
  badgeImage: '/logos/logo-1.png', // Default branded logo
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
      await new Promise((resolve) => setTimeout(resolve, 100));
      const dataUrl = await toPng(canvasRef.current, {
        quality: 1,
        pixelRatio: 1,
        width: 1080,
        height: 1080,
        style: { transform: 'scale(1)', transformOrigin: 'top left' },
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. يرجى اختيار صورة أقل من 2 ميجا بايت.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSlide({ logoImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBadgeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الملف كبير جداً. يرجى اختيار صورة أقل من 2 ميجا بايت.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSlide({ badgeImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const activeTheme = themes.find((t) => t.id === currentSlide.themeId) || themes[0];
  const inputClassName = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-y min-h-[42px]";

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
          {/* Theme Selector */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">نمط التصميم (الثيمات)</h2>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => updateSlide({ themeId: t.id })}
                  className={cn(
                    "px-3 py-2 text-xs font-medium rounded-md border transition-all text-right",
                    currentSlide.themeId === t.id 
                      ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-gray-200" />
          
          {/* Header Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">الترويسة</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">رفع شعار (اختياري)</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-md py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <ImageIcon size={18} className="text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">اختار صورة</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </label>
                  {currentSlide.logoImage && (
                    <button
                      onClick={() => updateSlide({ logoImage: undefined })}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-all"
                      title="حذف الشعار"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              
              {!currentSlide.logoImage && (
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
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">رفع شارة/لوغو يمين (اختياري)</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-md py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <ImageIcon size={18} className="text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">تغيير الصورة</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleBadgeUpload} />
                  </label>
                  {currentSlide.badgeImage && (
                    <button
                      onClick={() => updateSlide({ badgeImage: undefined })}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-all"
                      title="حذف الصورة"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              {!currentSlide.badgeImage && (
                <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">رمز الشارة</label>
                    <input
                      type="text"
                      value={currentSlide.badgeTop}
                      onChange={(e) => updateSlide({ badgeTop: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">نص الشارة</label>
                    <textarea
                      value={currentSlide.badgeMiddle}
                      onChange={(e) => updateSlide({ badgeMiddle: e.target.value })}
                      rows={2}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">السطر السفلي للشارة</label>
                    <textarea
                      value={currentSlide.badgeBottom}
                      onChange={(e) => updateSlide({ badgeBottom: e.target.value })}
                      rows={2}
                      className={inputClassName}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Main Content Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">المحتوى الرئيسي</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">العنوان الرئيسي</label>
                <textarea
                  value={currentSlide.title}
                  onChange={(e) => updateSlide({ title: e.target.value })}
                  rows={2}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">العنوان الفرعي</label>
                <textarea
                  value={currentSlide.subtitle}
                  onChange={(e) => updateSlide({ subtitle: e.target.value })}
                  rows={3}
                  className={inputClassName}
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
                    <textarea
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="العنوان (مثال: المقر)"
                      rows={2}
                      className="w-full bg-transparent border-b border-gray-300 px-1 py-1 text-xs font-bold text-gray-700 outline-none focus:border-blue-500 resize-y"
                    />
                    <textarea
                      value={field.value}
                      onChange={(e) => updateField(field.id, { value: e.target.value })}
                      placeholder="القيمة"
                      rows={3}
                      className="w-full bg-transparent border-b border-gray-300 px-1 py-1 text-sm text-gray-800 outline-none focus:border-blue-500 resize-y"
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
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">النص اليمين (عربي)</label>
                <textarea
                  value={currentSlide.footerRight}
                  onChange={(e) => updateSlide({ footerRight: e.target.value })}
                  rows={2}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">النص اليسار (إنجليزي)</label>
                <textarea
                  value={currentSlide.footerLeft}
                  onChange={(e) => updateSlide({ footerLeft: e.target.value })}
                  rows={2}
                  className={inputClassName}
                  dir="ltr"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative bg-gray-200">
        <div className="flex-1 overflow-auto flex items-center justify-center p-8">
          <div className="relative shadow-2xl transition-transform duration-200" style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
            <div
              ref={canvasRef}
              id="canvas-node"
              className={cn(
                "w-[1080px] h-[1080px] relative overflow-hidden flex flex-col",
                activeTheme.canvasBg
              )}
              dir="rtl"
            >
              <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none noise-overlay" />
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ opacity: activeTheme.patternOpacity }}
              >
                <div className="absolute inset-0 decorative-pattern" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
              </div>

              <div className="relative z-10 grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] px-16 py-14">
                <div className="flex justify-between items-start gap-10 pb-14">
                  {/* Badge / Top Right Brand */}
                  <div className="relative">
                    {currentSlide.badgeImage ? (
                      <div className="transition-all">
                        <img src={currentSlide.badgeImage} alt="Brand" className="max-h-24 w-auto object-contain" />
                      </div>
                    ) : (
                      <div className="relative p-[1px] border border-dashed border-gray-500/50">
                        {/* Decorative star */}
                        <div className={cn("absolute -top-4 -right-4", activeTheme.textColor, "opacity-80")}>✨</div>
                        
                        <div className={cn("flex min-h-24 items-stretch", activeTheme.badgeBg)}>
                          {/* Left Block */}
                          <div className={cn("bg-gradient-to-br w-24 flex items-center justify-center", activeTheme.badgeAccent)}>
                            <span className="text-5xl font-black text-white" dir="ltr">{currentSlide.badgeTop}</span>
                          </div>
                          {/* Right Text Block */}
                          <div className="flex min-w-0 flex-1 flex-col justify-center items-start px-6 py-3">
                            <span className={cn("text-2xl font-bold tracking-wide text-bounded text-wrap-2", activeTheme.badgeTextColor)}>{currentSlide.badgeMiddle}</span>
                            <div className="mt-1 max-w-full rounded-sm bg-white px-2 py-1 text-xs font-bold text-gray-900 text-bounded text-wrap-2" dir="ltr">
                              {currentSlide.badgeBottom}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={cn(
                      "flex items-center justify-center transition-all px-8 py-5 shadow-2xl min-h-24 min-w-48 rounded-sm",
                      currentSlide.logoImage ? "bg-transparent" : "bg-white"
                    )}
                  >
                    {currentSlide.logoImage ? (
                      <img src={currentSlide.logoImage} alt="Logo" className="max-h-20 w-auto object-contain" />
                    ) : (
                      <span className="text-3xl font-medium tracking-tight text-gray-900" dir="ltr">
                        {currentSlide.logoText}
                        <span className="inline-block ml-1 opacity-70">⟳</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="min-h-0 pb-8">
                  <h1 className={cn("text-6xl font-bold mb-4 tracking-tight text-bounded text-wrap-3", activeTheme.textColor)}>{currentSlide.title}</h1>
                  <p className={cn("text-2xl font-medium leading-relaxed text-bounded text-wrap-3", activeTheme.secondaryTextColor)}>{currentSlide.subtitle}</p>
                </div>

                <div className="relative min-h-0 overflow-hidden">
                  <div className="absolute inset-0 border border-gray-500/30 rounded-sm pointer-events-none">
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gray-400"></div>
                  </div>
                  
                  <div className="grid h-full auto-rows-min grid-cols-2 content-start gap-x-16 gap-y-8 overflow-hidden p-10">
                    {currentSlide.fields.map((field) => (
                      <div key={field.id} className="flex min-w-0 flex-col gap-2">
                        <div className={cn("flex min-w-0 items-start gap-2", activeTheme.accentColor)}>
                          <span className="text-xl leading-none -mt-1">□</span>
                          <span className="text-lg font-bold tracking-widest uppercase text-bounded text-wrap-2">{field.label}</span>
                        </div>
                        <div className={cn("pr-6 text-2xl font-medium leading-relaxed text-bounded text-wrap-3", activeTheme.textColor)}>
                          {field.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="absolute -top-12 -left-4 w-24 h-24 border border-white/20 flex items-center justify-center opacity-80">
                    <div className={cn("w-full h-full bg-gradient-to-br mix-blend-screen decorative-pattern", activeTheme.badgeAccent)}></div>
                  </div>
                </div>

                <div className="pt-8">
                  <div className={cn("w-full h-px bg-gradient-to-r from-transparent to-transparent mb-8", activeTheme.dividerColor)} />
                  <div className={cn("modern-footer flex items-end justify-between gap-6 px-4", activeTheme.textColor)}>
                    {/* Right Side (Arabic) */}
                    <div className="min-w-0 flex-1">
                      <span className="footer-text-glow block text-3xl font-bold tracking-tight text-bounded text-wrap-2">
                        {currentSlide.footerRight}
                      </span>
                    </div>
                    {/* Left Side (English) */}
                    <div className="min-w-0 max-w-[40%] text-left" dir="ltr">
                      <span className="footer-text-glow block text-3xl font-bold tracking-tight opacity-90 transition-opacity text-bounded text-wrap-2">
                        {currentSlide.footerLeft}
                      </span>
                    </div>
                  </div>
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
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                 <span className="text-white text-xs truncate px-2">{slide.title || `شريحة ${index + 1}`}</span>
              </div>
              
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
