## الهدف
جعل التنقل بين `/` و `/comments` أكثر سلاسة واحترافية، مع إزالة الومضات والقفزات الحالية.

## المشاكل الحالية
- `AnimatePresence` يعمل بـ `mode="wait"` مما يُحدث تأخيراً ملحوظاً (الصفحة الجديدة تنتظر خروج القديمة).
- `window.scrollTo` يُنفَّذ داخل `useEffect` بعد بدء الانتقال مما يسبب وميض/قفزة.
- شريط التنقل يستخدم `LayoutGroup` مع `layoutId="nav-active-pill"` بشكل صحيح، لكن الانتقال بين الروابط يبدو مفاجئاً بسبب الـ stiffness العالي (380).
- لا يوجد مؤشر تحميل أثناء انتقال الصفحة (`isTransitioning`).
- خلفية `HeroArrowBackdrop` تومض لأنها تُعاد حساباتها فور تغيّر المسار.

## التغييرات

### 1) `src/routes/__root.tsx` — انتقال صفحات أكثر احترافية
- تغيير `AnimatePresence` إلى `mode="popLayout"` للسماح بتداخل قصير بين الخروج والدخول.
- استخدام مدة 0.35s مع easing أكثر طبيعية + حركة دخول `y: 12 → 0` وخروج `y: -8` + blur خفيف (`filter: blur(4px) → blur(0)`) للإحساس السينمائي.
- نقل `scrollTo(0)` ليحدث في `onExitComplete` بدلاً من `useEffect` لمنع الومضة.
- إضافة شريط تقدّم علوي رفيع (`TopProgressBar`) يستمع إلى `router.subscribe('onBeforeLoad' / 'onResolved')` ويظهر فقط لو استغرق الانتقال > 120ms.

### 2) `src/components/Navbar.tsx` — حركة pill أكثر سلاسة
- خفض stiffness إلى 260 ودامبنغ 28 لحركة spring أنعم على الـ active pill.
- إضافة `whileTap={{ scale: 0.97 }}` على الروابط للإحساس باللمس.
- تحسين `transition-colors` ليشمل `duration-300` لتغيّر لون النص بسلاسة مع تحرّك الـ pill.
- تفعيل preload عبر `preload="intent"` صراحة على روابط TanStack (موجود globally، لكن نتأكد من وجود hover-prefetch).

### 3) `src/router.tsx` — ضبط preloading
- إبقاء `defaultPreload: "intent"` مع `defaultPreloadDelay: 50` لتحميل الصفحة فور المرور بالماوس → الانتقال يبدو فوريّاً.
- تفعيل `defaultPendingMs: 0` و`defaultPendingMinMs: 0` لتجنّب أي تأخير في pending state.

### 4) معالجة خلفية الـ Hero
- تمرير `key` ثابت لـ `HeroArrowBackdrop` خارج الـ AnimatedOutlet (هي بالفعل خارجه)، لكن نضيف `transition: opacity 200ms` بدل 300ms حتى لا يتأخر الفيد عند مغادرة الصفحة.

## النتيجة المتوقعة
- انتقال انسيابي مع fade + slide + blur خفيف بين `/` و `/comments`.
- pill النشط يتحرّك بـ spring ناعم بين الروابط دون قفز.
- شريط تقدّم رفيع يظهر فقط عند الحاجة الفعلية.
- لا قفزات scroll ولا ومضات في الخلفية.
- preload عند hover يجعل التنقل يبدو فوريّاً.

## ملفات ستُعدَّل
- `src/routes/__root.tsx`
- `src/components/Navbar.tsx`
- `src/router.tsx`
