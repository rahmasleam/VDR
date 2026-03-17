
import { VdrTab } from './types';

export const VDR_TABS: VdrTab[] = [
  {
    id: 'corporate',
    title: 'Corporate and Legal',
    description: 'المستندات القانونية الأساسية وهيكل الملكية.',
    fields: [
      { id: 'incorporation', label: 'Certificate of Incorporation', description: 'شهادة التأسيس الرسمية (PDF/Image)' },
      { id: 'articles', label: 'Articles of Association', description: 'النظام الأساسي للشركة (PDF)' },
      { id: 'capTable', label: 'Cap Table (Fully Diluted)', description: 'جدول الملكية (Excel/PDF)' },
      { id: 'agreements', label: 'ESOP & Founder Agreements', description: 'اتفاقيات المؤسسين (PDF)' },
      { id: 'ipAssignment', label: 'IP Assignment Agreements', description: 'إثبات ملكية الملكية الفكرية (PDF)' },
    ]
  },
  {
    id: 'product',
    title: 'Product and Technology',
    description: 'يشرح المنتج والتكنولوجيا وملكية الكود.',
    fields: [
      { id: 'overview', label: 'Product Specification', description: 'وصف المنتج التفصيلي (PDF)' },
      { id: 'roadmap', label: 'Product Roadmap', description: 'خطة تطوير المنتج (PDF/Image)' },
      { id: 'architecture', label: 'Technical Architecture', description: 'البنية التقنية (Diagram/PDF)' },
      { id: 'ownership', label: 'Source Code Ownership', description: 'بيان ملكية الكود (PDF)' },
      { id: 'security', label: 'Security Audit', description: 'تقرير التدقيق الأمني (PDF)' },
    ]
  },
  {
    id: 'market',
    title: 'Market and Business Model',
    description: 'تحليل السوق ونموذج الأعمال.',
    fields: [
      { id: 'tamsamsom', label: 'TAM/SAM/SOM Analysis', description: 'تحليل حجم السوق (PDF/Excel)' },
      { id: 'pricing', label: 'Pricing Model', description: 'تفاصيل نموذج التسعير (PDF)' },
      { id: 'economics', label: 'Unit Economics Data', description: 'بيانات اقتصاديات الوحدة (Excel)' },
      { id: 'strategy', label: 'Go-To-Market Plan', description: 'استراتيجية الدخول للسوق (PDF)' },
    ]
  },
  {
    id: 'traction',
    title: 'Traction and KPIs',
    description: 'مؤشرات الأداء والنمو.',
    fields: [
      { id: 'metrics', label: 'KPI Dashboard Export', description: 'تصدير مؤشرات الأداء (Excel/PDF)' },
      { id: 'mrr_arr', label: 'Revenue Statements', description: 'كشوفات الإيرادات (PDF)' },
      { id: 'cac_ltv', label: 'Marketing ROI Report', description: 'تقرير عائد التسويق (PDF)' },
      { id: 'cohort', label: 'User Retention Data', description: 'بيانات استبقاء المستخدمين (Excel)' },
    ]
  },
  {
    id: 'financials',
    title: 'Financials',
    description: 'البيانات المالية والتوقعات.',
    fields: [
      { id: 'pl', label: 'Historical P&L', description: 'القوائم المالية التاريخية (Excel/PDF)' },
      { id: 'burn', label: 'Cash Flow Statements', description: 'كشوفات التدفق النقدي (PDF)' },
      { id: 'model', label: 'Financial Forecasts', description: 'التوقعات المالية 3-5 سنوات (Excel)' },
      { id: 'funds', label: 'Budget Allocation', description: 'ميزانية استخدام التمويل (PDF)' },
    ]
  },
  {
    id: 'team',
    title: 'Team and HR',
    description: 'الفريق والإدارة.',
    fields: [
      { id: 'founders', label: 'Founders CVs', description: 'السير الذاتية للمؤسسين (PDF)' },
      { id: 'orgChart', label: 'Org Chart', description: 'الهيكل التنظيمي (Image/PDF)' },
      { id: 'equity', label: 'Stock Option Plan', description: 'خطة أسهم الموظفين (PDF)' },
    ]
  },
  {
    id: 'legal',
    title: 'Legal and Compliance',
    description: 'الالتزامات النظامية والعقود.',
    fields: [
      { id: 'contracts', label: 'Material Contracts', description: 'العقود الجوهرية (PDF Zip)' },
      { id: 'licenses', label: 'Regulatory Permits', description: 'التراخيص التنظيمية (PDF)' },
      { id: 'litigation', label: 'Legal History', description: 'بيان النزاعات القانونية (PDF)' },
    ]
  },
  {
    id: 'ip',
    title: 'IP and Intangibles',
    description: 'الأصول غير الملموسة.',
    fields: [
      { id: 'patents', label: 'Patents & Trademarks', description: 'براءات الاختراع والعلامات (PDF)' },
      { id: 'brand', label: 'Brand Guidelines', description: 'هوية العلامة التجارية (PDF)' },
      { id: 'domains', label: 'Domain Registrations', description: 'سجلات النطاق (PDF)' },
    ]
  },
  {
    id: 'risk',
    title: 'Risk and ESG',
    description: 'المخاطر والاستدامة.',
    fields: [
      { id: 'register', label: 'Risk Assessment', description: 'سجل تقييم المخاطر (PDF)' },
      { id: 'mitigation', label: 'Disaster Recovery Plan', description: 'خطة التعافي من الكوارث (PDF)' },
      { id: 'ethics', label: 'ESG Policy', description: 'سياسة الاستدامة والأخلاقيات (PDF)' },
    ]
  },
  {
    id: 'fundraising',
    title: 'Fundraising Documents',
    description: 'مستندات جمع التمويل.',
    fields: [
      { id: 'pitchdeck', label: 'Final Pitch Deck', description: 'العرض التقديمي النهائي (PDF)' },
      { id: 'termsheet', label: 'Term Sheet History', description: 'تاريخ شروط الاستثمار (PDF)' },
      { id: 'safe', label: 'SAFE Agreements', description: 'اتفاقيات التمويل الآمن (PDF)' },
      { id: 'shareholders', label: 'Shareholders Agreement', description: 'اتفاقية المساهمين (PDF)' },
    ]
  }
];
